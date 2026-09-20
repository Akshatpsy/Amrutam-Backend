# Amrutam Backend

A clean, modular backend for **Amrutam**, built with **NestJS**, **Fastify**, **Prisma**, **PostgreSQL**, and **Redis**.

This project powers the core backend workflows for a healthcare-style platform where:

- users can register and log in
- doctors can create and manage profiles
- doctors can publish availability slots
- patients can book appointments
- bookings can be viewed and cancelled

The backend is structured for maintainability, scalability, and clear separation of concerns.

---

## Overview

The goal of this project is to provide a solid MVP backend for Amrutam with real-world backend patterns such as:

- modular NestJS architecture
- repository pattern
- JWT-based authentication
- Prisma ORM with PostgreSQL
- Redis integration
- validation, guards, middleware, and exception handling

This is not just scaffolded code — the major flows have been implemented and tested.

---

## Features

### Authentication
- User registration
- User login
- Refresh token flow
- Current user profile endpoint

### Doctor Module
- Doctor onboarding
- Doctor profile update
- Fetch doctor by ID
- List doctors

### Availability Module
- Create availability slots
- Fetch doctor availability
- Delete availability slots

### Booking Module
- Patient creates a booking
- Patient views their bookings
- Doctor views their bookings
- Fetch booking by ID
- Cancel booking
- Unlock slot after cancellation

### Platform / Infrastructure
- Health check endpoint
- PostgreSQL integration
- Redis integration
- Config management
- Global exception handling
- Request middleware
- Role-based access control

---

## Tech Stack

- **Node.js**
- **NestJS 11**
- **Fastify**
- **TypeScript**
- **Prisma**
- **PostgreSQL**
- **Redis**
- **JWT**
- **pnpm**

---

## Project Structure

```text
src/
├── config/
├── modules/
│   ├── auth/
│   ├── users/
│   ├── doctors/
│   └── bookings/
├── platform/
│   ├── cache/
│   ├── database/
│   ├── docs/
│   ├── health/
│   ├── logger/
│   └── observability/
├── shared/
│   ├── decorators/
│   ├── filters/
│   ├── guards/
│   ├── middleware/
│   ├── pipes/
│   └── tokens.ts
└── main.ts
```

The structure is intentionally modular so each domain can grow independently without turning the project into a monolith mess.

---

## Environment Variables

Create a `.env` file in the root of the project.

Example:

```env
NODE_ENV=development
PORT=3000
API_PREFIX=api/v1
APP_NAME=amrutam-backend

DATABASE_URL=postgresql://postgres:postgres@localhost:5432/amrutam
REDIS_URL=redis://localhost:6379

JWT_ACCESS_SECRET=change-me-access
JWT_REFRESH_SECRET=change-me-refresh
JWT_ACCESS_TTL=15m
JWT_REFRESH_TTL_DAYS=7

BCRYPT_ROUNDS=12
LOG_LEVEL=info
```

---

## Getting Started

### 1. Install dependencies

```bash
pnpm install
```

### 2. Generate Prisma client

```bash
pnpm exec prisma generate
```

### 3. Run migrations

```bash
pnpm exec prisma migrate dev
```

### 4. Start the development server

```bash
pnpm start:dev
```

### 5. Verify TypeScript build

```bash
pnpm exec tsc --noEmit
```

---

## Main API Routes

## Auth
- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `POST /api/v1/auth/refresh`
- `GET /api/v1/auth/me`

## Doctors
- `POST /api/v1/doctors/onboard`
- `GET /api/v1/doctors`
- `GET /api/v1/doctors/:id`
- `PATCH /api/v1/doctors/profile`

## Availability
- `POST /api/v1/doctors/availability`
- `GET /api/v1/doctors/:id/availability`
- `DELETE /api/v1/doctors/availability/:id`

## Bookings
- `POST /api/v1/bookings`
- `GET /api/v1/bookings/me`
- `GET /api/v1/bookings/doctor`
- `GET /api/v1/bookings/:id`
- `PATCH /api/v1/bookings/:id/cancel`

## Health
- `GET /api/v1/health`

---

## Example Workflow

### Doctor flow
1. Register a user account
2. Assign the `DOCTOR` role
3. Log in
4. Onboard doctor profile
5. Create availability slots
6. View bookings
7. Cancel or manage bookings

### Patient flow
1. Register a user account
2. Log in
3. Browse doctors
4. Check availability
5. Book a slot
6. View bookings
7. Cancel a booking if needed

---

## Current MVP Status

### Completed
- Authentication flow
- Doctor onboarding and profile management
- Availability management
- Booking lifecycle
- Booking cancellation flow
- Slot re-availability after cancellation

### Notes
The backend is in a **working MVP state**.

A few refinements can still be made later, such as:
- logout endpoint
- better booking edge-case handling
- more automated tests
- clearer public doctor listing rules
- improved slot state modeling

---

## Development Notes

This project uses a layered approach:

- **presentation** for controllers and DTOs
- **application** for services and use-case logic
- **domain** for repository contracts and business abstractions
- **infrastructure** for Prisma-based implementations

This keeps the codebase easier to reason about and simpler to extend later.

---

## Health Check

You can verify the application is running with:

```bash
GET /api/v1/health
```

Expected response:

```json
{
  "status": "ok",
  "database": "up",
  "redis": "up"
}
```

---

## Recommended Next Improvements

If you continue beyond MVP, good next steps would be:

- add logout endpoint
- add email/phone verification
- add automated tests
- improve booking conflict rules
- align slot `status` and `isLocked` semantics
- improve Swagger docs
- add audit logging
- harden production configuration

---

## Useful Commands

### Type-check
```bash
pnpm exec tsc --noEmit
```

### Prisma generate
```bash
pnpm exec prisma generate
```

### Prisma migrate
```bash
pnpm exec prisma migrate dev
```

### Start dev server
```bash
pnpm start:dev
```

---

## License

Private project.

---

## Author

Built for the **Amrutam** backend MVP.
