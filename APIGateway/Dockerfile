#Set base image for container
#node:18 -> Node.js version 18
#alpine -> ultra-lightweight linux distro
FROM node:18-alpine

#Sets working directory inside container
#Everything after this line happens inside /usr/src/app
WORKDIR /usr/src/app

#Copies package.json and package-lock.json into working directory
#Because Docker uses layer caching, if code changes, Docker does not reinstall dependencies. Instead if package.json changes, Docker will reinstall dependencies
COPY package*.json ./

#Install production dependencies only. Ignores dev-dependencies
RUN npm ci --only=production

#Copies entire project into the container
COPY . .

#This tells Docker that this container listens on port 3000. It acts as a documentation
EXPOSE 3000

#Defines the default command that runs when the container starts and launches API-gateway server
CMD [ "node", "src/api-gateway-server.js" ]