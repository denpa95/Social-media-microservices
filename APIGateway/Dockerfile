# Use node:18-alpine as a base image. It's a lightweight Docker image combining node with Alpine Linux
FROM node:20-alpine

# Set working directory in container
WORKDIR /usr/src/app

# Copy package.json & package-lock.json into working directory
COPY package*.json ./

# Run command to install production dependencies excluding dev dependencies
RUN npm ci --only=production

# Copy remainding files into working directory
COPY . .

# Expose port
EXPOSE 3000

# Add default command to start app inside container when it launches
CMD ["node", "src/api-gateway-server.js"]