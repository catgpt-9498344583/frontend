# CatGPT Chatbot UI

A modern, responsive chatbot interface built with React, TypeScript, and Tailwind CSS. Features a clean chat experience with conversation management, dark mode, and content filtering.

## Features

- 💬 Real-time chat interface with streaming support
- 🌓 Dark/light mode toggle
- 📝 Multiple conversation management
- 🔗 Automatic URL linkification
- 🚫 Content filtering with blocklist
- 📱 Responsive design (mobile & desktop)
- ⚡ Built with Vite for fast development
- 🧪 Comprehensive test coverage with Vitest

## Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Vite** - Build tool & dev server
- **Vitest** - Testing framework
- **Docker** - Containerization

## Getting Started

### Prerequisites

- Node.js 18+ (for local development)
- Docker & Docker Compose (for containerized deployment)
- Backend API running on `http://localhost:5000` (see API section)

### Local Development (no Docker)

```bash
# Install dependencies
npm ci

# Start dev server
npm run dev
# Open http://localhost:5173
```

### Docker Development

```bash
# Start development container
docker compose -f docker-compose.dev.yml up
# Open http://localhost:5173
```

### Docker Production

```bash
# Build and start production container
docker compose up --build -d
# Open http://localhost:8080
```

## Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm test             # Run tests once
npm run test:watch   # Run tests in watch mode
```

## Project Structure

```
src/
├── App.tsx              # Main app component
├── ChatbotUI.tsx        # Chat interface component
├── blocklist.tsx        # Content filtering logic
├── linkify.tsx          # URL linkification utility
├── main.tsx             # App entry point
├── index.css            # Global styles
└── *.test.tsx           # Test files
```

## API Integration

The chatbot expects a backend API at `http://localhost:5000` with the following endpoints:

### POST `/api/chat`
```json
{
  "prompt": "user message",
  "sessionId": "optional-session-id"
}
```

Response:
```json
{
  "response": "bot response",
  "sessionId": "session-id"
}
```

### POST `/api/disconnect`
```json
{
  "sessionId": "session-id"
}
```

## Configuration

- **Port**: Configured in `vite.config.ts` (dev) and `docker-compose.yml` (prod)
- **API URL**: Hardcoded to `http://localhost:5000` in `ChatbotUI.tsx`
- **Styling**: Tailwind config in `tailwind.config.js`

## Testing

Tests are written using Vitest and React Testing Library:

```bash
# Run all tests
npm test

# Watch mode for development
npm run test:watch
```

## Dark Mode

Dark mode is enabled by default and can be toggled via the moon/sun button in the sidebar. The preference is stored in component state and applies the `dark` class to the document root.

## License

Private project - see package.json
