# 🚀 Production Deployment Guide

Hướng dẫn deploy Bình Minh FC lên production server.

## 📋 Checklist trước khi deploy

- [ ] Đã test kỹ trên local/staging
- [ ] Đã cấu hình environment variables production
- [ ] Đã backup database (nếu update)
- [ ] Đã review code changes
- [ ] Đã chuẩn bị rollback plan

## 🔐 Security Configuration

### 1. Đổi tất cả secrets

Trong `docker-compose.yml`:

```yaml
mysql:
  environment:
    MYSQL_ROOT_PASSWORD: "use-strong-password-here-min-16-chars"
    MYSQL_PASSWORD: "use-strong-password-here-min-16-chars"

app:
  environment:
    JWT_SECRET: "use-random-secure-key-min-32-chars"
```

### 2. Tạo secrets an toàn

```bash
# Generate random password
openssl rand -base64 32

# Generate JWT secret
openssl rand -hex 32
```

### 3. Không expose MySQL port

```yaml
mysql:
  # ports:
  #   - "3306:3306"  # ❌ Comment hoặc xóa dòng này
```

## 🌐 Deployment Methods

### Option 1: Deploy trên VPS (DigitalOcean, AWS EC2, etc.)

#### 1. Cài đặt dependencies

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Verify
docker --version
docker-compose --version
```

#### 2. Clone và cấu hình

```bash
# Clone repository
git clone <your-repo-url> bmfc
cd bmfc

# Copy và chỉnh sửa environment
cp .env.example .env
nano docker-compose.yml  # Đổi passwords và secrets
```

#### 3. Deploy

```bash
# Build và start
docker-compose up -d

# Check logs
docker-compose logs -f

# Verify
curl http://localhost:3000
```

#### 4. Setup Nginx Reverse Proxy (Optional)

```nginx
# /etc/nginx/sites-available/bmfc
server {
    listen 80;
    server_name bmfc.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/bmfc /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# Setup SSL with Let's Encrypt
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d bmfc.yourdomain.com
```

### Option 2: Deploy trên Docker Swarm

#### 1. Initialize Swarm

```bash
docker swarm init
```

#### 2. Deploy stack

```bash
docker stack deploy -c docker-compose.yml bmfc
```

#### 3. Scale services

```bash
docker service scale bmfc_app=3
```

### Option 3: Deploy trên Kubernetes

Cần convert docker-compose sang Kubernetes manifests:

```bash
# Install kompose
curl -L https://github.com/kubernetes/kompose/releases/download/v1.31.2/kompose-linux-amd64 -o kompose
chmod +x kompose
sudo mv ./kompose /usr/local/bin/kompose

# Convert
kompose convert

# Deploy
kubectl apply -f .
```

## 🔄 CI/CD Setup

### GitHub Actions Example

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2

      - name: Deploy to server
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.HOST }}
          username: ${{ secrets.USERNAME }}
          key: ${{ secrets.SSH_KEY }}
          script: |
            cd bmfc
            git pull origin main
            docker-compose down
            docker-compose build
            docker-compose up -d
```

## 📊 Monitoring

### 1. Health Checks

```bash
# Check containers
docker-compose ps

# Check logs
docker-compose logs -f

# Check app health
curl http://localhost:3000/api/fund
```

### 2. Setup monitoring tools

**Portainer (Docker UI):**

```bash
docker volume create portainer_data
docker run -d -p 9000:9000 -p 9443:9443 \
  --name=portainer --restart=always \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -v portainer_data:/data \
  portainer/portainer-ce:latest
```

**cAdvisor (Resource monitoring):**

```bash
docker run -d \
  --volume=/:/rootfs:ro \
  --volume=/var/run:/var/run:ro \
  --volume=/sys:/sys:ro \
  --volume=/var/lib/docker/:/var/lib/docker:ro \
  --publish=8080:8080 \
  --name=cadvisor \
  --privileged \
  --device=/dev/kmsg \
  gcr.io/cadvisor/cadvisor:latest
```

## 💾 Backup Strategy

### 1. Backup Database

```bash
# Manual backup
docker-compose exec mysql mysqldump -u bmfc_user -pbmfc_password binh_minh_fc > backup_$(date +%Y%m%d_%H%M%S).sql

# Restore
docker-compose exec -T mysql mysql -u bmfc_user -pbmfc_password binh_minh_fc < backup.sql
```

### 2. Automated Backup Script

```bash
#!/bin/bash
# backup.sh
BACKUP_DIR="/backups/bmfc"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR

docker-compose exec -T mysql mysqldump -u bmfc_user -pbmfc_password binh_minh_fc \
  | gzip > $BACKUP_DIR/bmfc_$DATE.sql.gz

# Keep only last 7 days
find $BACKUP_DIR -name "*.sql.gz" -mtime +7 -delete

echo "Backup completed: bmfc_$DATE.sql.gz"
```

### 3. Setup Cron Job

```bash
# Edit crontab
crontab -e

# Add daily backup at 2 AM
0 2 * * * /path/to/backup.sh >> /var/log/bmfc-backup.log 2>&1
```

## 🔄 Update Process

### 1. Zero-downtime update

```bash
# Pull latest code
git pull origin main

# Build new image
docker-compose build

# Rolling update (if using swarm)
docker service update --image bmfc_app:latest bmfc_app

# Or simple restart
docker-compose up -d --no-deps --build app
```

### 2. Database migrations

```bash
# Backup first!
docker-compose exec mysql mysqldump ... > backup.sql

# Run migrations
docker-compose exec app npx prisma migrate deploy

# If failed, rollback
docker-compose exec -T mysql mysql ... < backup.sql
```

## 🚨 Rollback

```bash
# Option 1: Git rollback
git revert <commit-hash>
docker-compose up -d --build

# Option 2: Previous image
docker tag bmfc_app:latest bmfc_app:backup
docker-compose up -d

# Option 3: Restore from backup
docker-compose down
docker volume rm bmfc_mysql_data
# Restore volume from backup
docker-compose up -d
```

## 📈 Performance Optimization

### 1. Enable caching

Add Redis for session/cache:

```yaml
services:
  redis:
    image: redis:alpine
    ports:
      - "6379:6379"
```

### 2. Database optimization

```sql
-- Add indexes
CREATE INDEX idx_member_status ON members(status);
CREATE INDEX idx_penalty_date ON penalties(date);
CREATE INDEX idx_monthly_fee_period ON monthly_fees(month, year);
```

### 3. Resource limits

```yaml
services:
  app:
    deploy:
      resources:
        limits:
          cpus: "1"
          memory: 512M
        reservations:
          cpus: "0.5"
          memory: 256M
```

## 🔍 Troubleshooting

### App không start

```bash
# Check logs
docker-compose logs app

# Check database connection
docker-compose exec app npx prisma db execute --stdin <<< "SELECT 1"

# Restart
docker-compose restart app
```

### Database issues

```bash
# Check MySQL logs
docker-compose logs mysql

# Check if MySQL is running
docker-compose exec mysql mysqladmin ping

# Reset and restore
docker-compose down -v
docker-compose up -d mysql
# Wait 30 seconds
docker-compose up -d app
```

## 📞 Support Checklist

- [ ] Document deployed version
- [ ] Setup error tracking (Sentry, etc.)
- [ ] Configure alerts (email/Slack)
- [ ] Create runbook for common issues
- [ ] Train team on deployment process

---

🎉 Good luck with your deployment!
