#!/bin/sh

echo "🔍 Checking database connection..."

# Wait for MySQL to be ready
until echo "SELECT 1" | npx prisma db execute --stdin > /dev/null 2>&1; do
  echo "⏳ Waiting for database to be ready..."
  sleep 2
done

echo "✅ Database is ready!"

# Run migrations
echo "🔄 Running database migrations..."
npx prisma migrate deploy

# Check if database is empty (first run)
RECORD_COUNT=$(echo "SELECT COUNT(*) as count FROM users" | npx prisma db execute --stdin 2>/dev/null | grep -o '[0-9]*' | head -1)

if [ -z "$RECORD_COUNT" ] || [ "$RECORD_COUNT" -eq "0" ]; then
  echo "🌱 Seeding database with initial data..."
  npx prisma db seed
else
  echo "✅ Database already seeded, skipping..."
fi

echo "🚀 Starting application..."
exec node server.js
