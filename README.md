# Bình Minh FC - Hệ thống Quản lý Câu lạc bộ ⚽

Website quản lý câu lạc bộ bóng đá "Bình Minh FC" với Next.js, TypeScript, Prisma và MySQL.

📚 **Tài liệu:**

- 🐳 [Docker Setup](./DOCKER.md) - Chạy với Docker & Docker Compose
- 🚀 [Deployment Guide](./DEPLOYMENT.md) - Hướng dẫn deploy production
- 💾 [Database Setup](./DATABASE_SETUP.md) - Cấu hình database local

## 🚀 Tính năng

### Admin

- ✅ Quản lý danh sách members (CRUD)
- ✅ Tạo danh sách nộp quỹ tháng (chọn từ danh sách members)
- ✅ Quản lý danh sách phạt hàng ngày (tick đã nộp)
- ✅ Tạo event chi tiêu (số tiền + lý do)

### Guest (Read-only)

- 👁️ Xem danh sách phạt hôm nay
- 👁️ Xem danh sách members
- 👁️ Xem danh sách người nộp quỹ tháng
- 👁️ Xem tổng quỹ
- 📊 Thống kê thu/chi theo khoảng thời gian (từ ngày -> đến ngày)

## 🛠️ Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Database:** MySQL + Prisma ORM
- **Authentication:** JWT (15 phút/phiên)
- **Styling:** TailwindCSS

## 📋 Yêu cầu

- Node.js 18+
- MySQL 8.0+
- npm hoặc yarn

## ⚙️ Cài đặt

### 🐳 Option 1: Docker (Recommended)

Cách nhanh nhất - chạy cả MySQL và app với Docker:

```bash
# Build và start
docker-compose up -d

# Xem logs
docker-compose logs -f

# Truy cập http://localhost:3000
```

**Tài khoản mặc định:**

- Admin: `admin` / `admin123`
- Guest: `guest` / `guest123`

📖 [Chi tiết Docker setup →](./DOCKER.md)

---

### 💻 Option 2: Local Development

#### 1. Cài đặt dependencies

```bash
npm install
```

#### 2. Cấu hình Database

Chỉnh sửa file `.env`:

```env
DATABASE_URL="mysql://root:password@localhost:3306/binh_minh_fc"
JWT_SECRET="your-secret-key-here"
JWT_EXPIRES_IN="15m"
```

#### 3. Tạo database và migrate

```bash
# Tạo database trong MySQL
mysql -u root -p
CREATE DATABASE binh_minh_fc;
exit;

# Chạy migration
npx prisma migrate dev --name init

# Seed dữ liệu mẫu
npx prisma db seed
```

#### 4. Chạy development server

```bash
npm run dev
```

Truy cập: http://localhost:3000

---

## 🔐 Tài khoản mặc định

Sau khi seed:

**Admin:**

- Username: `admin`
- Password: `admin123`

**Guest:**

- Username: `guest`
- Password: `guest123`

## 📁 Cấu trúc thư mục

```
bmfc/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── auth/         # Authentication
│   │   ├── members/      # Members CRUD
│   │   ├── monthly-fees/ # Quỹ tháng
│   │   ├── penalties/    # Phạt
│   │   ├── expenses/     # Chi tiêu
│   │   ├── statistics/   # Thống kê
│   │   └── fund/         # Tổng quỹ
│   ├── admin/            # Admin pages
│   ├── guest/            # Guest pages
│   └── login/            # Login page
├── lib/                   # Utilities
│   ├── prisma.ts         # Prisma client
│   ├── jwt.ts            # JWT helpers
│   ├── password.ts       # Password hashing
│   └── auth.ts           # Auth middleware
├── prisma/
│   ├── schema.prisma     # Database schema
│   └── seed.ts           # Seed script
└── public/               # Static files
```

## 🗄️ Database Schema

- **users** - Tài khoản (ADMIN/GUEST)
- **members** - Thành viên CLB
- **monthly_fees** - Quỹ tháng
- **penalties** - Phạt
- **expenses** - Chi tiêu

## 📊 API Endpoints

```
POST   /api/auth/login          - Đăng nhập
POST   /api/auth/logout         - Đăng xuất

GET    /api/members             - Lấy danh sách members
POST   /api/members             - Thêm member (Admin)
PUT    /api/members/:id         - Sửa member (Admin)
DELETE /api/members/:id         - Xóa member (Admin)

GET    /api/monthly-fees        - Lấy quỹ tháng
POST   /api/monthly-fees        - Thêm quỹ (Admin)
PUT    /api/monthly-fees/:id    - Cập nhật (Admin)

GET    /api/penalties           - Lấy phạt
POST   /api/penalties           - Thêm phạt (Admin)
PUT    /api/penalties/:id       - Cập nhật (Admin)
DELETE /api/penalties/:id       - Xóa phạt (Admin)

GET    /api/expenses            - Lấy chi tiêu
POST   /api/expenses            - Thêm chi tiêu (Admin)

GET    /api/fund                - Xem tổng quỹ
GET    /api/statistics          - Thống kê (from & to params)
```

## 🔧 Scripts

```bash
npm run dev          # Development server
npm run build        # Build production
npm run start        # Start production server
npm run lint         # Lint code

npx prisma studio    # Open Prisma Studio
npx prisma migrate   # Run migrations
npx prisma db seed   # Seed database
```

## 📝 Ghi chú

- JWT token hết hạn sau 15 phút
- Admin có toàn quyền CRUD
- Guest chỉ có quyền xem (read-only)
- Thống kê cho phép chọn khoảng thời gian tùy ý (from -> to)

---

Made with ⚽ for Bình Minh FC

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
