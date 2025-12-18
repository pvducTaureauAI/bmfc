# Environment Variables Documentation

Tài liệu về các biến môi trường sử dụng trong Bình Minh FC.

## 📝 Required Variables

### DATABASE_URL

**Mô tả:** Connection string cho MySQL database

**Format:** `mysql://USER:PASSWORD@HOST:PORT/DATABASE`

**Examples:**

```env
# Local development
DATABASE_URL="mysql://root:password@localhost:3306/binh_minh_fc"

# Docker
DATABASE_URL="mysql://bmfc_user:bmfc_password@mysql:3306/binh_minh_fc"

# Production (external)
DATABASE_URL="mysql://user:pass@db.example.com:3306/binh_minh_fc"
```

### JWT_SECRET

**Mô tả:** Secret key để sign và verify JWT tokens

**Yêu cầu:**

- Minimum 32 characters
- Random và unique
- KHÔNG share công khai

**Generate:**

```bash
# Method 1
openssl rand -hex 32

# Method 2
openssl rand -base64 32

# Method 3 (Node.js)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Examples:**

```env
# Development (weak - for testing only)
JWT_SECRET="development-secret-key-not-for-production"

# Production (strong)
JWT_SECRET="a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6"
```

### JWT_EXPIRES_IN

**Mô tả:** Thời gian expire của JWT token

**Format:** Time string (`s`, `m`, `h`, `d`)

**Examples:**

```env
# 15 minutes (mặc định)
JWT_EXPIRES_IN="15m"

# 1 hour
JWT_EXPIRES_IN="1h"

# 7 days
JWT_EXPIRES_IN="7d"

# 30 seconds (testing)
JWT_EXPIRES_IN="30s"
```

**Khuyến nghị:**

- Development: 1h - 24h
- Production: 15m - 1h
- Remember me: 7d - 30d

## 🌍 Environment-specific Variables

### NODE_ENV

**Mô tả:** Môi trường chạy application

**Values:** `development`, `production`, `test`

**Examples:**

```env
# Development
NODE_ENV="development"

# Production
NODE_ENV="production"

# Testing
NODE_ENV="test"
```

**Effects:**

- `development`: Enable verbose logging, hot reload
- `production`: Optimize performance, disable debug
- `test`: Use test database, mock services

## 🐳 Docker-specific Variables

### MySQL Environment Variables

```env
# Root password
MYSQL_ROOT_PASSWORD="your_root_password"

# Database name
MYSQL_DATABASE="binh_minh_fc"

# User credentials
MYSQL_USER="bmfc_user"
MYSQL_PASSWORD="bmfc_password"
```

## 📦 Complete Examples

### .env.development

```env
# Database
DATABASE_URL="mysql://root:root@localhost:3306/binh_minh_fc"

# JWT
JWT_SECRET="dev-secret-key-change-in-production"
JWT_EXPIRES_IN="1h"

# Node
NODE_ENV="development"
```

### .env.production

```env
# Database
DATABASE_URL="mysql://bmfc_user:STRONG_PASSWORD_HERE@mysql:3306/binh_minh_fc"

# JWT
JWT_SECRET="GENERATE_RANDOM_32_CHAR_KEY_HERE"
JWT_EXPIRES_IN="15m"

# Node
NODE_ENV="production"
```

### .env.test

```env
# Database
DATABASE_URL="mysql://root:test@localhost:3307/binh_minh_fc_test"

# JWT
JWT_SECRET="test-secret-key"
JWT_EXPIRES_IN="1h"

# Node
NODE_ENV="test"
```

## 🔐 Security Best Practices

### ✅ DO

- ✅ Sử dụng secrets manager (AWS Secrets Manager, Azure Key Vault, etc.)
- ✅ Rotate JWT_SECRET định kỳ
- ✅ Dùng strong passwords (minimum 16 characters)
- ✅ Không commit `.env` vào git (check `.gitignore`)
- ✅ Sử dụng khác JWT_SECRET cho mỗi environment
- ✅ Encrypt `.env` files trong CI/CD

### ❌ DON'T

- ❌ KHÔNG dùng default passwords
- ❌ KHÔNG share JWT_SECRET
- ❌ KHÔNG commit secrets vào git
- ❌ KHÔNG log sensitive data
- ❌ KHÔNG dùng JWT_SECRET quá ngắn
- ❌ KHÔNG hardcode secrets trong code

## 🛠️ Tools & Validation

### dotenv-validator

```bash
npm install --save-dev dotenv-validator

# Create .env.schema
cat > .env.schema << EOF
DATABASE_URL=string
JWT_SECRET=string
JWT_EXPIRES_IN=string
NODE_ENV=string
EOF

# Validate
npx dotenv-validator
```

### Check Environment

```bash
# Node.js script
node -e "
const envVars = ['DATABASE_URL', 'JWT_SECRET', 'JWT_EXPIRES_IN'];
const missing = envVars.filter(v => !process.env[v]);
if (missing.length) {
  console.error('Missing vars:', missing);
  process.exit(1);
}
console.log('✅ All required variables set');
"
```

## 🔄 Migration Guide

### From Local to Docker

**Before:**

```env
DATABASE_URL="mysql://root:password@localhost:3306/binh_minh_fc"
```

**After:**

```env
DATABASE_URL="mysql://bmfc_user:bmfc_password@mysql:3306/binh_minh_fc"
```

### From Docker to Production

1. Generate new JWT_SECRET:

   ```bash
   openssl rand -hex 32
   ```

2. Update passwords:

   ```env
   MYSQL_ROOT_PASSWORD="new_secure_password"
   MYSQL_PASSWORD="new_secure_password"
   JWT_SECRET="newly_generated_secret"
   ```

3. Update DATABASE_URL to match new password

## 📱 CI/CD Secrets

### GitHub Actions

```yaml
# .github/workflows/deploy.yml
env:
  DATABASE_URL: ${{ secrets.DATABASE_URL }}
  JWT_SECRET: ${{ secrets.JWT_SECRET }}
```

**Setup:**

1. Go to: Settings → Secrets and variables → Actions
2. Add: `DATABASE_URL`, `JWT_SECRET`, etc.

### GitLab CI

```yaml
# .gitlab-ci.yml
variables:
  DATABASE_URL: $DATABASE_URL
  JWT_SECRET: $JWT_SECRET
```

**Setup:**

1. Go to: Settings → CI/CD → Variables
2. Add variables with "Protected" and "Masked" flags

## 🐛 Troubleshooting

### Error: "JWT_SECRET is not defined"

**Solution:**

```bash
# Check .env file exists
ls -la .env

# Check variable is set
cat .env | grep JWT_SECRET

# Restart application
npm run dev
```

### Error: "Can't connect to MySQL"

**Solution:**

```bash
# Check DATABASE_URL format
echo $DATABASE_URL

# Test connection
npx prisma db execute --stdin <<< "SELECT 1"

# Check MySQL is running
docker-compose ps mysql
```

### Error: "Token expired"

**Solution:**

- JWT_EXPIRES_IN quá ngắn
- Tăng lên hoặc implement refresh tokens

## 📚 References

- [Prisma Connection URLs](https://www.prisma.io/docs/reference/database-reference/connection-urls)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)
- [12-Factor App - Config](https://12factor.net/config)
- [OWASP Secrets Management](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html)

---

🔐 Keep your secrets safe!
