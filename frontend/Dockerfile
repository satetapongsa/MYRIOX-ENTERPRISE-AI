# Frontend Dockerfile (Next.js)
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# For development, we don't need to build. 
# But for production-ready, we build:
# RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
COPY --from=builder /app /app
EXPOSE 3000
CMD ["npm", "run", "dev"]
