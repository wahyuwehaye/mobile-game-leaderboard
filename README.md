
# Leaderboard API

RESTful API untuk mobile game leaderboard, dibuat dengan NestJS (TypeScript) dan SQLite.

## Fitur Utama

- Submit skor pemain
- Ambil leaderboard (top 10 skor tertinggi)
- Autentikasi JWT (login/register)
- Role: user & admin
- Rate limiting pada endpoint skor
- Logging ke file (IP, method, endpoint, status)

## Endpoint

| Method | Endpoint         | Deskripsi                       |
|--------|------------------|---------------------------------|
| POST   | /auth/register   | Register user/admin             |
| POST   | /auth/login      | Login user/admin (JWT)          |
| POST   | /scores          | Submit skor (auth required)     |
| GET    | /leaderboard     | Ambil 10 skor tertinggi         |

## Cara Menjalankan (Local)

```bash
# Install dependencies
npm install

# Build TypeScript
npm run build

# Jalankan server
npm run start:prod
# Server: http://localhost:3000
```

## Database

- Menggunakan SQLite (file: leaderboard.sqlite, otomatis dibuat)
- Tidak perlu setup manual

## Jalankan dengan Docker

```bash
docker-compose up --build
# Server: http://localhost:3000
```

## Testing API

- Gunakan Postman collection: `Leaderboard-API.postman_collection.json`
- Import environment: `Leaderboard-API-Local.postman_environment.json`

## Struktur Project

- `src/` : Source code utama
- `logs/` : File log request
- `leaderboard.sqlite` : Database
- `Dockerfile` & `docker-compose.yml` : Untuk Docker

## Lisensi

MIT
# mobile-game-leaderboard
