# Amrutam-Backend
# Amrutam Backend

Backend API for **Amrutam**, built with **NestJS**, **Fastify**, **Prisma**, **PostgreSQL**, and **Redis**.

This project covers the full MVP backend flow for:

- authentication
- doctor onboarding
- doctor availability management
- patient booking flow

It is designed as a structured, modular backend with clear separation between domain, application, infrastructure, and presentation layers.

---

## What this project does

Amrutam Backend powers a healthcare-style appointment platform where:

- users can register and log in
- doctors can onboard themselves and manage their profiles
- doctors can publish available time slots
- patients can browse doctors and book available slots
- both doctors and patients can view booking details
- bookings can be cancelled, and cancelled slots become available again

---

## MVP status

### Completed
- User registration
- User login
- Refresh token flow
- Current user endpoint
- Health check endpoint
- Doctor onboarding
- Doctor profile update
- Doctor availability create/list/delete
- Patient booking create
- Patient booking list
- Doctor booking list
- Booking detail fetch
- Booking cancellation
- Slot unlock after cancellation

### Current state
This backend is **working for MVP use**.

---

## Tech stack

- **Node.js**
- **NestJS 11**
- **Fastify**
- **TypeScript**
- **Prisma**
- **PostgreSQL**
- **Redis**
- **JWT Authentication**
- **pnpm**

---

## Project structure

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
