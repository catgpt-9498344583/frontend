# Chatbot UI (React + TypeScript + Tailwind) with Docker

## Dev
```bash
docker compose -f docker-compose.dev.yml up
# http://localhost:5173
```

## Prod
```bash
docker compose up --build -d
# http://localhost:8080
```

## Local (no Docker)
```bash
npm ci
npm run dev
```
