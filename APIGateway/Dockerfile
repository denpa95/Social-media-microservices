#Use node:18-alpine as a base image. It's a lightweight Docker image combining node with Alpine Linux
FROM node:18-alpine

#Define working directory for app in Docker container
WORKDIR /usr/src/app

#Copy required file from local dir to working dir in Docker container
COPY package*.json ./

#Run command to install production dependencies excluding dev dependencies
RUN npm ci --only=production

#Copy remaining files to working directories
COPY . .

#Expose port to listen to
EXPOSE 3000

#Command to start application inside container
CMD ["node", "src/api-gateway-server.js"]