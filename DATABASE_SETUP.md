# Hướng dẫn Setup Database

## Bước 1: Cài đặt MySQL

Đảm bảo bạn đã cài đặt MySQL 8.0 trở lên trên máy.

## Bước 2: Tạo Database

Mở MySQL và tạo database:

```sql
CREATE DATABASE binh_minh_fc;
```

Hoặc dùng command line:

```bash
mysql -u root -p
# Nhập password
CREATE DATABASE binh_minh_fc;
exit;
```

## Bước 3: Cấu hình .env

Chỉnh sửa file `.env` trong thư mục root:

```env
DATABASE_URL="mysql://root:your_password@localhost:3306/binh_minh_fc"
JWT_SECRET="your-secret-key-change-in-production"
JWT_EXPIRES_IN="15m"
```

Thay `your_password` bằng password MySQL của bạn.

## Bước 4: Chạy Migration

```bash
npx prisma migrate dev --name init
```

Lệnh này sẽ:

- Tạo các bảng trong database
- Generate Prisma Client

## Bước 5: Seed Data (Optional)

Để tạo dữ liệu mẫu (admin, guest user và 5 members):

```bash
npx prisma db seed
```

Sau khi seed, bạn sẽ có:

- **Admin account:** username=`admin`, password=`admin123`
- **Guest account:** username=`guest`, password=`guest123`
- 5 members mẫu

## Bước 6: Kiểm tra Database

Mở Prisma Studio để xem dữ liệu:

```bash
npx prisma studio
```

## Troubleshooting

### Lỗi kết nối MySQL

Nếu gặp lỗi `Can't connect to MySQL server`:

- Kiểm tra MySQL đang chạy: `mysql.server status` (Mac) hoặc `net start mysql` (Windows)
- Kiểm tra port: mặc định là 3306
- Kiểm tra username/password trong file `.env`

### Lỗi "Unknown database"

Đảm bảo bạn đã tạo database `binh_minh_fc`:

```sql
SHOW DATABASES;
```

Nếu chưa có, chạy lại:

```sql
CREATE DATABASE binh_minh_fc;
```

### Reset Database

Nếu muốn reset toàn bộ:

```bash
npx prisma migrate reset
```

Lệnh này sẽ:

1. Xóa database
2. Tạo lại database mới
3. Chạy tất cả migrations
4. Chạy seed (nếu có)

## Tiếp theo

Sau khi setup xong database, chạy dev server:

```bash
npm run dev
```

Truy cập http://localhost:3000 và đăng nhập với tài khoản admin hoặc guest!
