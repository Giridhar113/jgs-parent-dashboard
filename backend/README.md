# JGS Parent Portal Backend

Dependency-free Node backend for the parent-only portal.

## Local Run

```bash
npm start
```

Local API base:

```txt
http://localhost:5000
```

## Demo Logins

```txt
Identifier: JGS/CSE/2024/048
PIN: 1248

Identifier: JGS/AIML/2025/021
PIN: 1248
```

## API Routes

```txt
POST /api/auth/login
GET  /api/dashboard/parent
GET  /api/parent/attendance
GET  /api/parent/progress
GET  /api/parent/fees
GET  /api/parent/fees/receipt
POST /api/messages
GET  /api/parent/notices
GET  /api/parent/events
GET  /api/parent/attendance/report
GET  /api/parent/progress/report
POST /api/payments/create
POST /api/payments/confirm
```

All non-login routes expect a bearer token returned by login:

```txt
Authorization: Bearer <token>
```

The frontend stores the token in `localStorage` as `jgs_token`.
