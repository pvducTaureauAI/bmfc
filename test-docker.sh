#!/bin/bash

echo "🧪 Testing Docker Setup for Bình Minh FC"
echo "========================================"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Docker is running
echo "1️⃣  Checking Docker..."
if ! docker info > /dev/null 2>&1; then
    echo -e "${RED}❌ Docker is not running${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Docker is running${NC}"
echo ""

# Check if docker-compose is available
echo "2️⃣  Checking Docker Compose..."
if ! docker-compose version > /dev/null 2>&1; then
    echo -e "${RED}❌ Docker Compose is not installed${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Docker Compose is available${NC}"
echo ""

# Build images
echo "3️⃣  Building Docker images..."
docker-compose build
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Build successful${NC}"
else
    echo -e "${RED}❌ Build failed${NC}"
    exit 1
fi
echo ""

# Start services
echo "4️⃣  Starting services..."
docker-compose up -d
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Services started${NC}"
else
    echo -e "${RED}❌ Failed to start services${NC}"
    exit 1
fi
echo ""

# Wait for services to be healthy
echo "5️⃣  Waiting for services to be ready..."
echo -e "${YELLOW}This may take 30-60 seconds...${NC}"
sleep 30

# Check if MySQL is healthy
echo "6️⃣  Checking MySQL health..."
if docker-compose exec -T mysql mysqladmin ping -h localhost -u root -pbmfc_root_password > /dev/null 2>&1; then
    echo -e "${GREEN}✅ MySQL is healthy${NC}"
else
    echo -e "${RED}❌ MySQL is not responding${NC}"
    docker-compose logs mysql
    exit 1
fi
echo ""

# Check if app is responding
echo "7️⃣  Checking application health..."
sleep 5
if curl -f http://localhost:3000 > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Application is responding${NC}"
else
    echo -e "${YELLOW}⚠️  Application may still be starting...${NC}"
    echo "Checking logs:"
    docker-compose logs app | tail -20
fi
echo ""

# Test database connection
echo "8️⃣  Testing database connection..."
if docker-compose exec -T app npx prisma db execute --stdin <<< "SELECT 1" > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Database connection successful${NC}"
else
    echo -e "${RED}❌ Database connection failed${NC}"
    exit 1
fi
echo ""

# Check users count
echo "9️⃣  Checking seeded data..."
USERS_COUNT=$(docker-compose exec -T mysql mysql -u bmfc_user -pbmfc_password binh_minh_fc -e "SELECT COUNT(*) as count FROM users;" -s -N 2>/dev/null)
if [ "$USERS_COUNT" -ge "2" ]; then
    echo -e "${GREEN}✅ Database has been seeded (${USERS_COUNT} users)${NC}"
else
    echo -e "${YELLOW}⚠️  Database may not be seeded properly${NC}"
fi
echo ""

# Summary
echo "========================================"
echo -e "${GREEN}🎉 Docker setup test completed!${NC}"
echo ""
echo "📝 Next steps:"
echo "  1. Open http://localhost:3000"
echo "  2. Login with:"
echo "     - Admin: admin / admin123"
echo "     - Guest: guest / guest123"
echo ""
echo "🔧 Useful commands:"
echo "  - View logs: docker-compose logs -f"
echo "  - Stop: docker-compose down"
echo "  - Restart: docker-compose restart"
echo ""
echo "📖 More info: See DOCKER.md"
