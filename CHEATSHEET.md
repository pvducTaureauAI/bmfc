# 🛠️ Cheat Sheet - Bình Minh FC

Quick reference cho các commands thường dùng.

## 🐳 Docker Commands

### Khởi động nhanh

```bash
# Windows
start-docker.bat

# Linux/Mac
docker-compose up -d

# Hoặc dùng Makefile
make up
```

### Quản lý services

```bash
# Start
docker-compose up -d

# Stop
docker-compose down

# Restart
docker-compose restart

# Restart một service
docker-compose restart app

# Stop và xóa volumes
docker-compose down -v
```

### Logs và Debugging

```bash
# Xem logs
docker-compose logs -f

# Xem logs một service
docker-compose logs -f app
docker-compose logs -f mysql

# Xem logs 100 dòng cuối
docker-compose logs --tail=100 app

# Vào shell của container
docker-compose exec app sh
docker-compose exec mysql bash
```

### Build và Deploy

```bash
# Build lại
docker-compose build

# Build không cache
docker-compose build --no-cache

# Build và start
docker-compose up -d --build

# Update một service
docker-compose up -d --no-deps --build app
```

## 💾 Database Commands

### Prisma

```bash
# Generate Client
npx prisma generate

# Run migrations
npx prisma migrate dev
npx prisma migrate deploy  # Production

# Seed database
npx prisma db seed

# Reset database (⚠️ Xóa data)
npx prisma migrate reset

# Open Prisma Studio
npx prisma studio

# Format schema
npx prisma format
```

### MySQL trong Docker

```bash
# MySQL CLI
docker-compose exec mysql mysql -u bmfc_user -pbmfc_password binh_minh_fc

# Backup database
docker-compose exec mysql mysqldump -u bmfc_user -pbmfc_password binh_minh_fc > backup.sql

# Restore database
docker-compose exec -T mysql mysql -u bmfc_user -pbmfc_password binh_minh_fc < backup.sql

# Check connection
docker-compose exec mysql mysqladmin ping -h localhost
```

## 🔧 Development Commands

### NPM Scripts

```bash
# Install dependencies
npm install

# Development server
npm run dev

# Build production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

### Git Workflow

```bash
# Check status
git status

# Stage changes
git add .

# Commit
git commit -m "feat: add feature"

# Push
git push origin main

# Pull latest
git pull origin main
```

## 🔍 Troubleshooting Commands

### Check Docker

```bash
# Docker info
docker info

# Docker version
docker --version
docker-compose --version

# List containers
docker ps
docker ps -a  # Include stopped

# List images
docker images

# Check resources
docker system df

# Clean up
docker system prune -a
```

### Check Application

```bash
# Test endpoint
curl http://localhost:3000

# Test API
curl http://localhost:3000/api/fund

# Check if app is running
docker-compose ps

# Inspect container
docker inspect bmfc_app
```

### MySQL Debugging

```bash
# Check MySQL process
docker-compose exec mysql ps aux | grep mysql

# Check MySQL variables
docker-compose exec mysql mysql -u root -pbmfc_root_password -e "SHOW VARIABLES LIKE '%version%';"

# Check databases
docker-compose exec mysql mysql -u root -pbmfc_root_password -e "SHOW DATABASES;"

# Check tables
docker-compose exec mysql mysql -u bmfc_user -pbmfc_password binh_minh_fc -e "SHOW TABLES;"

# Check table structure
docker-compose exec mysql mysql -u bmfc_user -pbmfc_password binh_minh_fc -e "DESCRIBE users;"
```

## 📊 Monitoring Commands

### Resource Usage

```bash
# Container stats
docker stats

# Specific container
docker stats bmfc_app

# Docker disk usage
docker system df -v
```

### Logs Analysis

```bash
# Follow logs with timestamp
docker-compose logs -f -t

# Search logs
docker-compose logs app | grep ERROR

# Export logs
docker-compose logs app > app.log
```

## 🚀 Production Commands

### Deployment

```bash
# Pull latest code
git pull origin main

# Build and deploy
docker-compose down
docker-compose build
docker-compose up -d

# Health check
curl http://localhost:3000
docker-compose ps
```

### Backup

```bash
# Backup with timestamp
DATE=$(date +%Y%m%d_%H%M%S)
docker-compose exec mysql mysqldump -u bmfc_user -pbmfc_password binh_minh_fc | gzip > backup_$DATE.sql.gz

# List backups
ls -lh backup_*.sql.gz

# Restore latest backup
gunzip < backup_latest.sql.gz | docker-compose exec -T mysql mysql -u bmfc_user -pbmfc_password binh_minh_fc
```

### Monitoring

```bash
# Check uptime
docker ps --format "table {{.Names}}\t{{.Status}}"

# Check logs for errors
docker-compose logs --tail=100 | grep -i error

# Database size
docker-compose exec mysql mysql -u bmfc_user -pbmfc_password binh_minh_fc -e "
SELECT
  table_schema AS 'Database',
  ROUND(SUM(data_length + index_length) / 1024 / 1024, 2) AS 'Size (MB)'
FROM information_schema.tables
WHERE table_schema = 'binh_minh_fc'
GROUP BY table_schema;"
```

## 🔐 Security Commands

### Update passwords

```bash
# Change MySQL root password
docker-compose exec mysql mysql -u root -pOLD_PASSWORD -e "ALTER USER 'root'@'localhost' IDENTIFIED BY 'NEW_PASSWORD';"

# Change MySQL user password
docker-compose exec mysql mysql -u root -pROOT_PASSWORD -e "ALTER USER 'bmfc_user'@'%' IDENTIFIED BY 'NEW_PASSWORD';"

# Don't forget to update docker-compose.yml!
```

### SSL/TLS (với Nginx)

```bash
# Install certbot
sudo apt install certbot python3-certbot-nginx

# Get certificate
sudo certbot --nginx -d yourdomain.com

# Auto-renewal test
sudo certbot renew --dry-run
```

## 📦 Make Commands (nếu có Makefile)

```bash
# Show help
make help

# Start production
make up

# Stop
make down

# View logs
make logs

# Only MySQL for dev
make dev-db

# Run migrations
make migrate

# Seed database
make seed

# MySQL CLI
make mysql-cli

# Shell access
make shell

# Rebuild everything
make rebuild
```

## ⚡ One-liners

```bash
# Quick restart app
docker-compose restart app && docker-compose logs -f app

# Rebuild app only
docker-compose up -d --no-deps --build app

# Clean and restart everything
docker-compose down -v && docker-compose up -d

# Check all service health
docker-compose ps && docker-compose exec mysql mysqladmin ping && curl -s http://localhost:3000 > /dev/null && echo "All services healthy!"

# Database backup with auto-filename
docker-compose exec mysql mysqldump -u bmfc_user -pbmfc_password binh_minh_fc > backup_$(date +%Y%m%d_%H%M%S).sql

# Count records in all tables
docker-compose exec mysql mysql -u bmfc_user -pbmfc_password binh_minh_fc -e "
SELECT table_name, table_rows
FROM information_schema.tables
WHERE table_schema = 'binh_minh_fc'
ORDER BY table_rows DESC;"
```

## 🎯 Quick Fixes

### Port already in use

```bash
# Find process using port 3000
lsof -i :3000  # Mac/Linux
netstat -ano | findstr :3000  # Windows

# Kill process
kill -9 <PID>  # Mac/Linux
taskkill /PID <PID> /F  # Windows

# Or change port in docker-compose.yml
```

### Out of disk space

```bash
# Clean Docker
docker system prune -a --volumes

# Check space
df -h  # Linux/Mac
```

### Container won't start

```bash
# Check logs
docker-compose logs <service>

# Remove and recreate
docker-compose down
docker-compose up -d --force-recreate
```

---

💡 **Tip:** Bookmark this file for quick reference!
