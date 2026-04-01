# 🎉 PartyPlace

An AI-powered venue search application for finding event spaces in New York City.

## Overview

PartyPlace lets users search for venues using plain English. Describe your event naturally — the AI interprets your request, extracts key details, and returns matching venues from our dataset.

> "I want to throw a birthday party for 50 people in Brooklyn on Saturday evening with a $2000 budget"

## Tech Stack

- **Frontend** — Next.js (TypeScript) + Tailwind CSS
- **Backend** — NestJS (TypeScript)
- **AI** — OpenAI GPT-4o-mini for natural language parsing

## Features

- 🔍 Natural language search powered by OpenAI
- 🎯 Automatic filter extraction (budget, guests, location, occasion, day, time)
- ✅ Business rule validation with helpful suggestions
- 📋 Browse all 30 NYC venues on the homepage
- 💅 Pink/purple themed UI with responsive design

## Business Rules

- Weekend bookings require a minimum budget of $1,500
- Guest count cannot exceed 150
- Budget must be greater than $0

## Project Structure
```
PartyPlace/
├── backend/          # NestJS API
│   └── src/
│       └── search/   # Search module (controller, service)
├── frontend/         # Next.js app
│   └── app/
│       ├── page.tsx        # Homepage with search + all venues
│       └── results/        # Results page with applied filters
└── venues.json       # Mock venue dataset (30 NYC venues)
```

## Getting Started

### Prerequisites
- Node.js v20+
- OpenAI API key

### Backend
```bash
cd backend
npm install
echo "OPENAI_API_KEY=your-key-here" > .env
npm run start:dev
# Runs on http://localhost:3001
```

### Frontend
```bash
cd frontend
npm install
npm run dev
# Runs on http://localhost:3000
```

## API

### `POST /search`
Takes a natural language query and returns matched venues.

**Request**
```json
{ "query": "Birthday party for 40 people in SoHo on Friday evening" }
```

**Response**
```json
{
  "valid": true,
  "parsed": {
    "occasion": "Birthday",
    "guestCount": 40,
    "location": "SoHo",
    "day": "Friday",
    "time": "evening"
  },
  "results": [...]
}
```