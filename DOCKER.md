# 🐳 Docker Setup Guide - Bình Minh FC

Hướng dẫn chạy ứng dụng với Docker và Docker Compose.

## 📋 Yêu cầu

- Docker Desktop 20.10+
- Docker Compose 2.0+

## 🚀 Quick Start

### Option 1: Production Mode (Docker Compose)

Chạy cả MySQL và Next.js app trong containers:

```bash
# Build và start tất cả services
docker-compose up -d

# Xem logs
docker-compose logs -f

# Stop services
docker-compose down

# Stop và xóa volumes (reset database)
docker-compose down -v
```

Truy cập: **http://localhost:3000**

Tài khoản mặc định:

- Admin: `admin` / `admin123`
- Guest: `guest` / `guest123`

### Option 2: Development Mode (MySQL only)

Chỉ chạy MySQL trong Docker, app chạy local:

```bash
# Start MySQL container
docker-compose -f docker-compose.dev.yml up -d

# Update .env file
DATABASE_URL="mysql://root:root@localhost:3306/binh_minh_fc"

# Run migrations
npx prisma migrate dev

# Seed data
npx prisma db seed

# Start Next.js dev server
npm run dev
```

## 📦 Docker Compose Services

### Production (`docker-compose.yml`)

**Services:**

1. **mysql** - MySQL 8.0 database

   - Port: 3306
   - User: `bmfc_user`
   - Password: `bmfc_password`
   - Database: `binh_minh_fc`

2. **app** - Next.js application
   - Port: 3000
   - Auto migration on startup
   - Auto seed on first run

**Volumes:**

- `mysql_data` - Persistent MySQL data

### Development (`docker-compose.dev.yml`)

**Services:**

1. **mysql** - MySQL 8.0 only
   - Port: 3306
   - Root password: `root`
   - Database: `binh_minh_fc`

## 🔧 Useful Commands

### Build và Deploy

```bash
# Build lại images
docker-compose build

# Build không dùng cache
docker-compose build --no-cache

# Start services
docker-compose up -d

# Restart một service
docker-compose restart app
```

### Logs và Debug

```bash
# Xem logs tất cả services
docker-compose logs -f

# Xem logs một service
docker-compose logs -f app
docker-compose logs -f mysql

# Vào shell của container
docker-compose exec app sh
docker-compose exec mysql bash
```

### Database Operations

```bash
# Run migrations
docker-compose exec app npx prisma migrate deploy

# Seed database
docker-compose exec app npx prisma db seed

# Open Prisma Studio (không khả dụng trong container)
# Dùng local: npx prisma studio

# MySQL CLI
docker-compose exec mysql mysql -u bmfc_user -pbmfc_password binh_minh_fc
```

### Cleanup

```bash
# Stop containers
docker-compose down

# Stop và xóa volumes (reset database)
docker-compose down -v

# Xóa tất cả (containers, volumes, networks, images)
docker-compose down -v --rmi all
```

## ⚙️ Configuration

### Production Environment Variables

Chỉnh sửa trong `docker-compose.yml`:

```yaml
environment:
  DATABASE_URL: "mysql://bmfc_user:bmfc_password@mysql:3306/binh_minh_fc"
  JWT_SECRET: "your-production-secret-key" # ⚠️ ĐỔI NÀY!
  JWT_EXPIRES_IN: "15m"
```

### Custom MySQL Password

```yaml
mysql:
  environment:
    MYSQL_ROOT_PASSWORD: your_root_password
    MYSQL_USER: your_user
    MYSQL_PASSWORD: your_password
    MYSQL_DATABASE: binh_minh_fc

app:
  environment:
    DATABASE_URL: "mysql://your_user:your_password@mysql:3306/binh_minh_fc"
```

## 🔍 Troubleshooting

### MySQL Connection Failed

**Lỗi:** `Can't reach database server at mysql:3306`

**Giải pháp:**

```bash
# Kiểm tra MySQL đã ready
docker-compose logs mysql

# Restart MySQL
docker-compose restart mysql

# Chờ healthcheck pass
docker-compose ps
```

### App không start sau migration

**Lỗi:** Migration failed hoặc seed failed

**Giải pháp:**

```bash
# Reset database
docker-compose down -v
docker-compose up -d mysql

# Chờ MySQL ready (10-20s)
sleep 15

# Start app
docker-compose up -d app
```

### Port đã được sử dụng

**Lỗi:** `port is already allocated`

**Giải pháp:**

```bash
# Đổi port trong docker-compose.yml
services:
  app:
    ports:
      - "3001:3000"  # Đổi từ 3000 thành 3001

  mysql:
    ports:
      - "3307:3306"  # Đổi từ 3306 thành 3307
```

### Permission denied

**Lỗi:** `Permission denied` khi build

**Giải pháp:**

```bash
# Trên Linux/Mac
sudo docker-compose up -d

# Hoặc thêm user vào docker group
sudo usermod -aG docker $USER
```

## 🚢 Deploy to Production

### Using Docker Compose

```bash
# 1. Clone repo trên server
git clone <repo-url>
cd bmfc

# 2. Cập nhật environment variables
nano docker-compose.yml  # Đổi JWT_SECRET và passwords

# 3. Build và start
docker-compose up -d

# 4. Kiểm tra logs
docker-compose logs -f
```

### Using Docker Swarm / Kubernetes

Tham khảo thêm tài liệu orchestration cho production scale.

## 📊 Health Check

```bash
# Kiểm tra status containers
docker-compose ps

# Kiểm tra app
curl http://localhost:3000

# Kiểm tra MySQL
docker-compose exec mysql mysqladmin ping -h localhost -u root -pbmfc_root_password
```

## 🔐 Security Notes

⚠️ **QUAN TRỌNG cho Production:**

1. **Đổi tất cả passwords mặc định**

   - MySQL root password
   - MySQL user password
   - JWT_SECRET

2. **Không expose MySQL port ra ngoài**

   ```yaml
   mysql:
     # ports:
     #   - "3306:3306"  # Comment dòng này
   ```

3. **Sử dụng secrets management**

   - Docker secrets
   - Environment variables từ CI/CD
   - Vault, AWS Secrets Manager, etc.

4. **Enable SSL/TLS**
   - Nginx reverse proxy với Let's Encrypt
   - MySQL SSL connections

## 📚 Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Reference](https://docs.docker.com/compose/compose-file/)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Prisma with Docker](https://www.prisma.io/docs/guides/deployment/deployment-guides/deploying-to-docker)

---

Made with 🐳 for Bình Minh FC
