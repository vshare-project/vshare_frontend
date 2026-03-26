# VShare Frontend

Ứng dụng React cho nền tảng cho thuê xe điện nội đô VShare.

## Tech Stack

- **Framework**: Vite + React 18 + TypeScript
- **Styling**: Tailwind CSS v3 (Dark theme - Electric Green)
- **Routing**: React Router v6
- **State**: Zustand (persisted)
- **HTTP**: Axios (auto token inject + 401 refresh)
- **Forms**: React Hook Form + Zod
- **Maps**: React Leaflet (dark tile)
- **UI**: Custom components + Radix UI primitives
- **Icons**: Lucide React
- **Toast**: Sonner

## Cài đặt

```bash
npm install
npm run dev
```

## Biến môi trường

```env
VITE_API_URL=http://localhost:8080/api
```

## Cấu trúc Routes

| Route | Mô tả | Bảo vệ |
|-------|-------|--------|
| `/` | Trang chủ | Không |
| `/map` | Bản đồ trạm xe | Không |
| `/rent/:vehicleId` | Thuê xe | Đăng nhập |
| `/profile` | Tài khoản | Đăng nhập |
| `/login` | Đăng nhập | Không |
| `/register` | Đăng ký | Không |
| `/admin` | Dashboard | ADMIN/STAFF |
| `/admin/vehicles` | Quản lý xe | ADMIN/STAFF |
| `/admin/stations` | Quản lý trạm | ADMIN/STAFF |
| `/admin/users` | Quản lý users | ADMIN/STAFF |
| `/admin/subscriptions` | Gói dịch vụ | ADMIN/STAFF |

## Kết nối API

Tất cả API calls đi qua `src/api/axios.ts`:
- Auto attach `Authorization: Bearer <token>`
- Auto refresh token khi 401
- Redirect về `/login` nếu refresh thất bại

## Mock Data

Hiện tại dùng mock data. Để kết nối API thật:
1. Update `VITE_API_URL` trong `.env`
2. Thay mock data trong từng page bằng API calls từ `src/api/`
