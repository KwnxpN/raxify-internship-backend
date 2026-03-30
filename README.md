# Events API — Internship Backend
A simple public REST API for managing events, built for frontend internship assignments.
This API allows interns to:
- View events
- Create new events
- Update register count of an event

No authentication required. No image upload. Focus is on frontend skills.

---

## Tech Stack
- Node.js (v22)

- Express.js

- PostgreSQL

- Drizzle ORM

- TypeScript

- Docker

## Features
- Create event

- Get all events

- Get event by ID

- Simple validation

- ISO date handling

- Ready for frontend integration

## Project Structure
```
raxify-internship-backend/
├── src/
│   ├── controllers/
│   │   └── eventsControllers.ts
│   ├── db/
│   │   ├── index.ts
│   │   └── schema.ts
│   ├── routes/
│   │   └── eventsRoutes.ts
│   └── index.ts
│
├── dist/                  # Compiled output
├── .env                   # Environment variables
├── .env.example           # Example env file
├── docker-compose.yml
├── Dockerfile
├── drizzle.config.ts
├── package.json
├── pnpm-lock.yaml
└── tsconfig.json
```
