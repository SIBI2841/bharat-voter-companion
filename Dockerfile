FROM node:20-bookworm-slim AS build
RUN apt-get update && apt-get upgrade -y && rm -rf /var/lib/apt/lists/*

# Build Frontend
WORKDIR /app/client
COPY client/package*.json ./
RUN npm install
COPY client/ ./
RUN npm run build

# Setup Backend
FROM node:20-bookworm-slim
RUN apt-get update && apt-get upgrade -y && rm -rf /var/lib/apt/lists/*

WORKDIR /app/server
COPY server/package*.json ./
RUN npm install --production
COPY server/ ./

# Copy built frontend assets
COPY --from=build /app/client/dist /app/client/dist

# Expose port (Google Cloud Run expects 8080 by default)
EXPOSE 8080

ENV NODE_ENV=production

CMD ["npm", "start"]
