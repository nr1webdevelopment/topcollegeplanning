#!/usr/bin/env python3
"""
reddit-blog-bot.py
==================
Top College Planning — automated blog writer.

What it does every time you run it:
  1. Fetches the top posts this week from 4 college subreddits
  2. Grabs the top comments for the most-engaged post
  3. Sends everything to Claude (Anthropic API) to write a full blog article
  4. Injects the article into content.json as a new post
  5. Prints a summary so you know what was added

Setup (one-time):
  pip3 install anthropic requests
  export ANTHROPIC_API_KEY="sk-ant-..."

Schedule (macOS cron — run daily at 7am):
  crontab -e
  0 7 * * * /usr/bin/python3 /path/to/reddit-blog-bot.py >> /tmp/blog-bot.log 2>&1
"""

import os
import json
import time
import re
import requests
from datetime import date
from anthropic import Anthropic

# ── Config ──────────────────────────────────────────────────────────────────
CONTENT_JSON = os.path.join(
    os.path.dirname(__file__),
    "../src/data/content.json"
)

SUBREDDITS = [
    "ApplyingToCollege",
    "college",
    "SAT",
    "chanceme",
]

POSTS_PER_SUB  = 5      # how many top posts to pull per subreddit
TIMEFRAME      = "week" # "day" | "week" | "month"
TOP_COMMENTS   = 8      # how many comments to include per post
MAX_COMMENT_LEN = 300   # trim long comments to this length

HEADERS = {
    "User-Agent": "TopCollegePlanning/2.0 (blog research; contact gary@garymakesart.com)"
}

CATEGORIES = ["General", "Stories"]

# ── Step 1: Fetch Reddit ─────────────────────────────────────────────────────
def fetch_top_posts(subreddit: str, limit: int, timeframe: str) -> list[dict]:
    url = f"https://www.reddit.com/r/{subreddit}/top.json?limit={limit}&t={timeframe}"
    resp = requests.get(url, headers=HEADERS, timeout=15)
    resp.raise_for_status()
    children = resp.json()["data"]["children"]
    posts = []
    for c in children:
        d = c["data"]
        posts.append({
            "subreddit": subreddit,
            "id":        d["id"],
            "title":     d["title"],
            "score":     d["score"],
            "comments":  d["num_comments"],
            "selftext":  d.get("selftext", "")[:600],
            "permalink": d["permalink"],
        })
    return posts

def fetch_comments(permalink: str, limit: int) -> list[str]:
    url = f"https://www.reddit.com{permalink}.json?limit={limit}&sort=top"
    resp = requests.get(url, headers=HEADERS, timeout=15)
    resp.raise_for_status()
    data = resp.json()
    comments = []
    if len(data) < 2:
        return comments
    for child in data[1]["data"]["children"]:
        body = child["data"].get("body", "").strip()
        if body and body != "[deleted]" and body != "[removed]":
            comments.append(body[:MAX_COMMENT_LEN])
        if len(comments) >= limit:
            break
    return comments

def gather_reddit_content() -> dict:
    """Returns the best post + its comments, plus a summary of all top posts."""
    all_posts = []
    for sub in SUBREDDITS:
        print(f"  Fetching r/{sub}...")
        try:
            posts = fetch_top_posts(sub, POSTS_PER_SUB, TIMEFRAME)
            all_posts.extend(posts)
            time.sleep(1)  # be polite to Reddit
        except Exception as e:
            print(f"  Warning: r/{sub} failed — {e}")

    if not all_posts:
        raise RuntimeError("Could not fetch any Reddit posts. Check your internet connection.")

    # Score by engagement (comments weighted 3x because they signal discussion)
    all_posts.sort(key=lambda p: p["score"] + p["comments"] * 3, reverse=True)

    best = all_posts[0]
    print(f"\n  ✓ Best post: [{best['subreddit']}] "{best['title']}" "
          f"(score={best['score']}, comments={best['comments']})")

    print(f"  Fetching comments for best post...")
    try:
        comments = fetch_comments(best["permalink"], TOP_COMMENTS)
        time.sleep(1)
    except Exception as e:
        print(f"  Warning: Could not fetch comments — {e}")
        comments = []

    return {
        "best_post": best,
        "comments":  comments,
        "top_posts": all_posts[:12],  # send top 12 as context to Claude
    }

# ── Step 2: Write article with Claude ───────────────────────────────────────
SYSTEM_PROMPT = """
You are the staff writer for Top College Planning, a website that helps high school students
and their parents navigate the college admissions process.

Your job is to turn real Reddit discussions from college-focused subreddits into genuine,
helpful blog articles. Your writing style:
- Warm but direct, never preachy
- Uses the Reddit discussion as a launch pad — not a transcription
- Gives real, actionable advice (not vague encouragement)
- Cites Reddit anonymously ("One ATC commenter noted...", "A student on r/college wrote...")
- Ends with 1-2 internal links using <a href="/blog/slug">anchor text</a> format

Output ONLY valid JSON (no markdown fences, no preamble) with exactly these fields:
{
  "slug":    "url-safe-slug-max-6-words",
  "title":   "Article title (punchy, 8-12 words)",
  "excerpt": "One sentence teaser, max 35 words.",
  "content": "Full HTML article, using <h2>, <h3>, <p>, <blockquote>, <ul>/<li>. No <html>/<body> tags."
}
""".strip()

def build_user_prompt(reddit_data: dict) -> str:
    best      = reddit_data["best_post"]
    comments  = reddit_data["comments"]
    top_posts = reddit_data["top_posts"]

    other_titles = "\n".join(
        f"- [{p['subreddit']}] {p['title']} (↑{p['score']} / {p['comments']} comments)"
        for p in top_posts[1:10]
    )

    comment_block = "\n\n".join(
        f'"{c}"' for c in comments
    ) if comments else "(no comments fetched)"

    return f"""
Today's date: {date.today().isoformat()}

FEATURED REDDIT POST (most-engaged this week):
Subreddit: r/{best['subreddit']}
Title: {best['title']}
Score: {best['score']} upvotes | {best['comments']} comments
Post text:
{best['selftext'] or '(link post — no body text)'}

TOP COMMENTS:
{comment_block}

OTHER TRENDING TOPICS THIS WEEK (for context / potential article angles):
{other_titles}

Write a full blog article inspired by the featured post and its discussion.
The article should be genuinely useful to a high school student or parent reading it.
Minimum 600 words of HTML content.
""".strip()

def generate_article(reddit_data: dict) -> dict:
    api_key = os.environ.get("ANTHROPIC_API_KEY")
    if not api_key:
        raise EnvironmentError(
            "ANTHROPIC_API_KEY not set.\n"
            "Run: export ANTHROPIC_API_KEY='sk-ant-...'"
        )

    client = Anthropic(api_key=api_key)
    prompt = build_user_prompt(reddit_data)

    print("\n  Calling Claude to write the article...")
    message = client.messages.create(
        model="claude-opus-4-6",
        max_tokens=4096,
        system=SYSTEM_PROMPT,
        messages=[{"role": "user", "content": prompt}],
    )

    raw = message.content[0].text.strip()

    # Strip markdown code fences if Claude added them anyway
    raw = re.sub(r"^```(?:json)?\s*", "", raw)
    raw = re.sub(r"\s*```$", "", raw)

    article = json.loads(raw)
    return article

# ── Step 3: Inject into content.json ────────────────────────────────────────
def get_next_id(posts: list) -> int:
    if not posts:
        return 1000
    return max(p.get("id", 0) for p in posts) + 1

def inject_post(article: dict) -> None:
    path = os.path.abspath(CONTENT_JSON)
    with open(path) as f:
        data = json.load(f)

    posts = data.get("posts", [])

    # Don't publish a duplicate slug
    existing_slugs = {p["slug"] for p in posts}
    slug = article["slug"]
    if slug in existing_slugs:
        slug = f"{slug}-{date.today().isoformat()}"
        article["slug"] = slug

    new_post = {
        "id":             get_next_id(posts),
        "slug":           article["slug"],
        "title":          article["title"],
        "date":           date.today().isoformat(),
        "excerpt":        article["excerpt"],
        "content":        article["content"],
        "categories":     CATEGORIES,
        "featured_media": 0,
    }

    data["posts"].insert(0, new_post)

    with open(path, "w") as f:
        json.dump(data, f, indent=4, ensure_ascii=False)

    print(f"\n  ✓ Added to content.json:")
    print(f"    slug:    {new_post['slug']}")
    print(f"    title:   {new_post['title']}")
    print(f"    excerpt: {new_post['excerpt']}")
    print(f"    URL:     /blog/{new_post['slug']}")

# ── Main ────────────────────────────────────────────────────────────────────
def main():
    print("=" * 60)
    print("Top College Planning — Reddit Blog Bot")
    print(f"Date: {date.today().isoformat()}")
    print("=" * 60)

    print("\n[1/3] Fetching Reddit...")
    reddit_data = gather_reddit_content()

    print("\n[2/3] Writing article with Claude...")
    article = generate_article(reddit_data)

    print("\n[3/3] Injecting into content.json...")
    inject_post(article)

    print("\n✅ Done! Rebuild your Next.js site to publish.")
    print("   cd topcollegeplanning-nextjs && npm run build")

if __name__ == "__main__":
    main()
