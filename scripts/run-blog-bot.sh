#!/bin/bash
# run-blog-bot.sh
# Wrapper script for cron/launchd — sets up the environment then runs the bot.
#
# To schedule daily at 7am, run: crontab -e   and add:
#   0 7 * * * /Users/tech/Desktop/TopCollegePlanning/topcollegeplanning-nextjs/scripts/run-blog-bot.sh
#
# Or to run manually:
#   chmod +x run-blog-bot.sh && ./run-blog-bot.sh

# ── Set your API key here (or export it in your shell profile) ──
export ANTHROPIC_API_KEY="sk-ant-YOUR_KEY_HERE"

# ── Paths ──
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
LOG_FILE="$SCRIPT_DIR/../blog-bot.log"
PYTHON="$(which python3)"

# ── Install dependencies if needed ──
$PYTHON -c "import anthropic, requests" 2>/dev/null || \
    $PYTHON -m pip install anthropic requests --quiet

# ── Run the bot ──
echo "" >> "$LOG_FILE"
echo "===== $(date) =====" >> "$LOG_FILE"
$PYTHON "$SCRIPT_DIR/reddit-blog-bot.py" >> "$LOG_FILE" 2>&1

echo "Done. Check $LOG_FILE for details."
