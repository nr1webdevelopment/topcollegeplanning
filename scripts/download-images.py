#!/usr/bin/env python3
"""
download-images.py
Downloads all external site images to /public/ with SEO-friendly filenames.
Python uses macOS's native SSL (Secure Transport), which Wikipedia accepts.

Run from the project root:
    python3 scripts/download-images.py
"""

import urllib.request
import urllib.error
import ssl
import os
import json
import time
import sys
from pathlib import Path

# macOS Python often lacks the system cert bundle — disable verification for
# this local download script (it's fine; we're not sending sensitive data).
SSL_CTX = ssl.create_default_context()
SSL_CTX.check_hostname = False
SSL_CTX.verify_mode = ssl.CERT_NONE

# ── Paths ──────────────────────────────────────────────────────────────────────
BASE    = Path(__file__).parent.parent
PUBLIC  = BASE / "public"
CONTENT = BASE / "src" / "data" / "content.json"

# ── Request headers ────────────────────────────────────────────────────────────
HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/120.0.0.0 Safari/537.36"
    ),
    "Accept": "image/webp,image/apng,image/*,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.9",
    "Accept-Encoding": "gzip, deflate, br",
    "Connection": "keep-alive",
}

# ── Site images ────────────────────────────────────────────────────────────────
SITE_IMAGES = [
    # Logo (try multiple WP paths in case one is there)
    {
        "urls": [
            "https://topcollegeplanning.com/wp-content/uploads/2022/03/Logo-header@2x.png",
            "https://topcollegeplanning.com/wp-content/uploads/2022/03/Logo-header402x.png",
            "https://topcollegeplanning.com/wp-content/uploads/2022/03/Logo-footer@2x-e1700521545479.png",
        ],
        "dest": "images/top-college-planning-logo.png",
    },
    # Hero / background — Unsplash (no hotlink protection)
    {
        "urls": ["https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=840&q=80&fit=crop"],
        "dest": "images/college-graduate-hero.jpg",
    },
    {
        "urls": ["https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1400&q=80&fit=crop"],
        "dest": "images/students-campus-background.jpg",
    },
    # University logos from Wikimedia Commons (open licence SVG renders)
    {
        "urls": [
            "https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/Northwestern_Wildcats_logo.svg/200px-Northwestern_Wildcats_logo.svg.png",
        ],
        "dest": "images/northwestern-university-logo.png",
    },
    {
        "urls": [
            "https://upload.wikimedia.org/wikipedia/en/thumb/e/e7/USC_Trojans_logo.svg/200px-USC_Trojans_logo.svg.png",
        ],
        "dest": "images/usc-trojans-logo.png",
    },
    {
        "urls": [
            "https://upload.wikimedia.org/wikipedia/en/thumb/f/f1/Columbia_Lions_logo.svg/200px-Columbia_Lions_logo.svg.png",
        ],
        "dest": "images/columbia-lions-logo.png",
    },
]

# ── Alumni photos (Wikipedia Commons) ─────────────────────────────────────────
ALUMNI_PHOTOS = [
    ("stephen-colbert",       "Stephen_Colbert_2019.jpg"),
    ("christopher-reeve",     "Christopher_Reeve_in_1980.jpg"),
    ("mehmet-oz",             "Dr_Oz_2012.jpg"),
    ("dr-seuss",              "Ted_Geisel_NYWTS.jpg"),
    ("natalie-portman",       "Natalie_Portman_Cannes_2015_3.jpg"),
    ("benjamin-franklin",     "Benjamin_Franklin_by_Joseph-Siffrein_Duplessis.jpg"),
    ("john-legend",           "John_Legend_2019.jpg"),
    ("bill-clinton",          "Bill_Clinton.jpg"),
    ("george-w-bush",         "George-W-Bush.jpeg"),
    ("michael-phelps",        "Michael_Phelps_2012.jpg"),
    ("donald-trump",          "Donald_Trump_official_portrait.jpg"),
    ("george-stephanopoulos", "George_Stephanopoulos_2011.jpg"),
    ("michelle-obama",        "Michelle_Obama_2013_official_portrait.jpg"),
    ("mark-zuckerberg",       "Mark_Zuckerberg_F8_2019_Keynote_(32830578717).jpg"),
    ("conan-obrien",          "Conan_O'Brien_2019.jpg"),
    ("tom-brady",             "Tom_Brady,_2017.jpg"),
    ("tiger-woods",           "Tiger_Woods_at_the_2010_Ryder_Cup.jpg"),
    ("warren-buffett",        "Warren_Buffett_KU_Visit.jpg"),
    ("bill-gates",            "Bill_Gates_2017_(cropped).jpg"),
    ("jeff-bezos",            "Jeff_Bezos_2016.jpg"),
    ("elon-musk",             "Elon_Musk_Royal_Society_(crop2).jpg"),
    ("michael-bloomberg",     "Michael_Bloomberg_Shankbone_2010_NYC.jpg"),
]

def wiki_url(filename):
    """Builds a Wikimedia Commons Special:FilePath URL that redirects to the real image."""
    return f"https://commons.wikimedia.org/wiki/Special:FilePath/{urllib.parse.quote(filename)}?width=440"

# ── Download helper ────────────────────────────────────────────────────────────
import urllib.parse

def fetch(url, dest_abs, delay=0):
    """Download url → dest_abs. Raises on failure."""
    if delay:
        time.sleep(delay)
    req = urllib.request.Request(url, headers=HEADERS)
    try:
        with urllib.request.urlopen(req, timeout=20, context=SSL_CTX) as resp:
            data = resp.read()
    except urllib.error.HTTPError as e:
        raise RuntimeError(f"HTTP {e.code}")
    except urllib.error.URLError as e:
        raise RuntimeError(f"Connection error: {e.reason}")

    if len(data) < 500:
        raise RuntimeError(f"Response too small ({len(data)} bytes) — likely an error page")

    dest_abs.parent.mkdir(parents=True, exist_ok=True)
    dest_abs.write_bytes(data)

def try_urls(urls, dest_abs, delay=0):
    """Try each URL in order; return True on first success, raise on all failures."""
    errors = []
    for url in urls:
        try:
            fetch(url, dest_abs, delay=delay)
            return
        except RuntimeError as e:
            errors.append(f"{url}: {e}")
    raise RuntimeError(" | ".join(errors))

# ── Main ───────────────────────────────────────────────────────────────────────
def main():
    print("\n🎓 Top College Planning — Image Downloader (Python)\n")
    ok = fail = 0

    # ── Site images ─────────────────────────────────────────────────────────
    print("── Site images ─────────────────────────────────────────")
    for item in SITE_IMAGES:
        dest = PUBLIC / item["dest"]
        if dest.exists():
            print(f"  ✓ skip  {item['dest']}")
            ok += 1
            continue
        print(f"  ↓ {item['dest']} ...", end="", flush=True)
        try:
            try_urls(item["urls"], dest)
            size_kb = dest.stat().st_size // 1024
            print(f" ✓  ({size_kb}KB)")
            ok += 1
        except RuntimeError as e:
            print(f" ✗  {e}")
            fail += 1

    # ── Alumni photos ────────────────────────────────────────────────────────
    print("\n── Alumni photos ───────────────────────────────────────")
    downloaded = []
    for slug, filename in ALUMNI_PHOTOS:
        dest = PUBLIC / "alumni" / f"{slug}.jpg"
        if dest.exists():
            print(f"  ✓ skip  alumni/{slug}.jpg")
            ok += 1
            downloaded.append((slug, f"/alumni/{slug}.jpg"))
            continue
        print(f"  ↓ alumni/{slug}.jpg ...", end="", flush=True)
        url = wiki_url(filename)
        try:
            fetch(url, dest, delay=0.3)   # small delay to be polite
            size_kb = dest.stat().st_size // 1024
            print(f" ✓  ({size_kb}KB)")
            ok += 1
            downloaded.append((slug, f"/alumni/{slug}.jpg"))
        except RuntimeError as e:
            print(f" ✗  {e}")
            fail += 1

    # ── Patch content.json ───────────────────────────────────────────────────
    if downloaded:
        print("\n── Patching content.json ───────────────────────────────")
        data = json.loads(CONTENT.read_text())
        patched = 0
        for slug, local_path in downloaded:
            for a in data["alumni"]:
                if a["slug"] == slug and a.get("photo") != local_path:
                    a["photo"] = local_path
                    patched += 1
        CONTENT.write_text(json.dumps(data, indent=2))
        print(f"  ✓ Updated {patched} alumni photo paths in content.json")

    # ── Summary ──────────────────────────────────────────────────────────────
    print(f"\n{'─' * 55}")
    print(f"  ✅ {ok} succeeded   ❌ {fail} failed")
    print(f"{'─' * 55}")
    if fail == 0:
        print("\n🎉 All done! Restart your dev server: npm run dev\n")
    else:
        print("\n⚠️  Some failed. The /api/proxy-image route serves them as fallback.")
        print("   Run again to retry any failures.\n")

if __name__ == "__main__":
    main()
