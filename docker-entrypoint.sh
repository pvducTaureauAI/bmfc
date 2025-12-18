#!/bin/sh

echo "🔍 Checking database connection..."

# Wait for MySQL to be ready
until echo "SELECT 1" | npx prisma db execute --stdin --schema=./prisma/schema.prisma > /dev/null 2>&1; do
  echo "⏳ Waiting for database to be ready..."
  sleep 2
done

echo "✅ Database is ready!"

# Run migrations or push schema (for first setup)
echo "🔄 Running database migrations..."
if [ -d "prisma/migrations" ] && [ "$(ls -A prisma/migrations)" ]; then
  npx prisma migrate deploy --schema=./prisma/schema.prisma
else
  echo "No migrations found, pushing schema directly..."
  npx prisma db push --schema=./prisma/schema.prisma --accept-data-loss
fi

# Check if database is empty (first run)
RECORD_COUNT=$(echo "SELECT COUNT(*) as count FROM users" | npx prisma db execute --stdin --schema=./prisma/schema.prisma 2>/dev/null | grep -o '[0-9]*' | head -1)

if [ -z "$RECORD_COUNT" ] || [ "$RECORD_COUNT" -eq "0" ]; then
  echo "🌱 Seeding database with initial data..."
  npx prisma db seed
else
  echo "✅ Database already seeded, skipping..."
fi

echo "🚀 Starting application..."
exec node server.js
