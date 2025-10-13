FROM node:20-alpine AS build
WORKDIR /app

COPY package.json package-lock.json* yarn.lock* pnpm-lock.yaml* ./
RUN if [ -f package-lock.json ]; then npm ci;     elif [ -f yarn.lock ]; then corepack enable && yarn install --frozen-lockfile;     elif [ -f pnpm-lock.yaml ]; then corepack enable && pnpm install --frozen-lockfile;     else npm install; fi

COPY . .
RUN npm run build
