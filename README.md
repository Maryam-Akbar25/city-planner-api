# SkyPlan — Smart City & Weather Planner

SkyPlan is a full-stack city itinerary and weather planning web application. Users can register securely, schedule upcoming city visits or activities and automatically fetch real-time weather forecasts paired with dynamic, weather adaptive UI cards.

# Key Features
Authentication & Security: JWT-based user registration and login with bcryptjs password hashing.

Live Weather Integration: Automatically resolves city names and fetches current temperature (°C) and weather conditions when creating or updating plans.

Full CRUD Itinerary Management: Create, view, search/filter, update, and delete city plans persisted in SQLite.

Weather-Adaptive Glassmorphism UI: Cards dynamically shift color gradients and icons (Sunny, Rainy, Cloudy, Snowy) based on live weather summaries, enhanced with smooth Framer Motion transitions.

Interactive API Documentation: Built-in Swagger UI available at /api-docs.

# Tech Stack
Frontend: React.js (Vite), Tailwind CSS v4, Framer Motion, Lucide Icons, Axios

Backend: Node.js, Express.js, SQLite, JSON Web Tokens (JWT), Swagger UI

# Project Architecture (Monorepo)

```text
SkyPlan Project/
├── backend/              # Node.js + Express REST API + SQLite (MVC + Service Layer)
│   ├── src/
│   │   ├── config/       # SQLite DB & Swagger API documentation setup
│   │   ├── controllers/  # Auth & Plan business logic
│   │   ├── middlewares/  # JWT auth guard, request logger & error handler
│   │   ├── models/       # User & Plan SQLite data models
│   │   ├── routes/       # Express route definitions
│   │   ├── services/     # Live weather API integration service
│   │   └── app.js        # Express app configuration
│   └── server.js         # Server entry point
├── frontend/             # React + Vite + Tailwind CSS + Framer Motion UI
│   └── src/
│       ├── api/          # Axios client with automatic JWT interceptor
│       ├── components/   # Navbar, CreatePlanModal & weather-themed PlanCard
│       ├── pages/        # AuthPage (Login/Register) & Dashboard
│       └── App.jsx       # Route/auth guard with crossfade transitions
├── .gitignore
└── README.md
