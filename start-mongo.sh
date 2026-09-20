#!/bin/zsh
# Start MongoDB locally (no Homebrew needed)
# Usage: ./start-mongo.sh

MONGOD="$HOME/mongodb-local/mongodb-macos-aarch64--8.3.11/bin/mongod"
DBPATH="$HOME/mongodb-local/data"
LOGPATH="$HOME/mongodb-local/logs/mongod.log"

# Check if already running
if nc -z localhost 27017 2>/dev/null; then
  echo "✅ MongoDB is already running on port 27017"
  exit 0
fi

mkdir -p "$DBPATH" "$HOME/mongodb-local/logs"
echo "🚀 Starting MongoDB..."
nohup "$MONGOD" --dbpath "$DBPATH" --logpath "$LOGPATH" --port 27017 --bind_ip 127.0.0.1 > /dev/null 2>&1 &

sleep 2
if nc -z localhost 27017 2>/dev/null; then
  echo "✅ MongoDB started! PID: $!"
  echo "📁 Data: $DBPATH"
  echo "📄 Logs: $LOGPATH"
else
  echo "❌ Failed to start. Check logs: $LOGPATH"
fi
