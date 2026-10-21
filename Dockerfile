# Multi-stage production Dockerfile for QUBOT
FROM node:22-alpine AS builder

WORKDIR /app

# Copy package manifests
COPY package.json ./

# Install all dependencies for build
RUN npm install

# Copy application source
COPY . .

# Build production assets to /app/dist
RUN npm run build

# Production runner stage
FROM node:22-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000

COPY package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/public ./public

EXPOSE 3000

# Run production server
CMD ["npm", "run", "start"]
