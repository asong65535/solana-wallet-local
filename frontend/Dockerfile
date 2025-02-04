# Use Node.js for building Next.js app
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json package-lock.json ./
RUN npm install --omit=dev

# Copy source code and build Next.js app
COPY . .
RUN npm run build

# Run Next.js in a separate container
FROM node:18-alpine
WORKDIR /app

# Copy built files
COPY --from=builder /app ./

# Expose Next.js port
EXPOSE 3000

# Start Next.js in production mode
CMD ["npm", "start"]

