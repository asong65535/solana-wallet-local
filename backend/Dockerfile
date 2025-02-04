# Use lightweight Node.js image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json package-lock.json ./
RUN npm install --omit=dev

# Copy the rest of the app
COPY . .

# Expose backend port
EXPOSE 3001

# Start the server
CMD ["node", "server.js"]

