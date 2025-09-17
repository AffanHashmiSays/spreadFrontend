# ------------------------
# Stage 1: Build the app
# ------------------------
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Install dependencies separately for caching
COPY package*.json ./
RUN npm install --frozen-lockfile

# Copy all files
COPY . .

# Build the Next.js app
RUN npm run build

# ------------------------
# Stage 2: Run the app
# ------------------------
FROM node:18-alpine AS runner

WORKDIR /app

# Copy only necessary files from builder
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.js ./next.config.js

# Set env to production
ENV NODE_ENV=production
ENV PORT=3301

# Expose the port
EXPOSE 3301

# Run Next.js
CMD ["npm", "start"]
