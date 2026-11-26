# Smart Task & Weather Planner API

A RESTful Node.js & Express backend that allows authenticated users to create, manage, and track location-tagged plans enriched with real-time weather data from the Open-Meteo API.

## Tech Stack
- **Runtime & Framework:** Node.js (ES Modules), Express 5
- **Database:** SQLite (`better-sqlite3`) with relational foreign-key constraints
- **Authentication:** JSON Web Tokens (`jsonwebtoken`) & password hashing (`bcryptjs`)
- **External API:** Open-Meteo Geocoding & Weather Forecast APIs (via native `fetch`)

## Project Architecture
```text
city-planner-api/
├── src/
│   ├── config/db.js              # SQLite connection & schema initialization
│   ├── controllers/              # Route handlers & business logic
│   ├── middlewares/              # JWT guard, request logger, centralized error handler
│   ├── models/                   # Parameterized SQL queries (User & Plan)
│   ├── routes/                   # Express route definitions
│   ├── services/weatherService.js# Open-Meteo geocoding & live weather integration
│   └── app.js                    # Express app setup
├── .env                          # Environment variables (ignored by Git)
├── package.json
└── server.js                     # Application entry point