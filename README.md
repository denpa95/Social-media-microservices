# Project overview

A scalable social media backend built using Node.js, Express and microservices architecture. The system includes API gateway, proxy gateway for microservices, redis caching, rate limiting for added security, message queueing protocol using RabbitMQ as message broker, file upload feature, cloud file storage and Docker based deployment.

# Architecture

## Microservices

The project consists of 5 microservices, each running independently:

- API-gateway - acts as gateway and proxy for other microservices. All requests pass through this server
- Identity-microservice - handles user registration, login/logout, and JWT/refresh token
- Media-microservice - handles media file upload, user can also fetch and delete any media
- Search-microservice - handles search query for posts
- Post microservice - handles user post creation, deletion, fetches post by ID, and fetches all posts

## Communication between Microservices

- REST API - service to service
- RabbitMQ - event driven Communication between microservices
- Redis - caching and rate-limiting to reduce latency and increase security

# Architecture Diagram
 
													Client
                                                      |
                                                      |                      
                            -------------------- API Gateway -----------------------------------------------
                           |                          |                          |                         |
                           |                          |                          |                         |
                   Identity-service         User authentication        User authentication       User authentication
                                                      |                          |                         |
                                                      |                          |                         |
                                                 Post service               Media-service                  |
                                                      |                          |                         |
                                                      |                          |                         |
                                                       -------- RabbitMQ --------                          |
                                                                   |                                       |
                                                                   |                                       |
                                                             Search-service -------------------------------


                   
# Tech Stack

- Node.js
- Express
- Mongoose/MongoDB Atlas
- Redis
- RabbitMQ
- Cloudinary
- multer
- Docker/Docker compose
- JWT authentication
- Winston logger
- JOI data validator
- Helmet
- CORS
- dotenv
- nodemon
- argon2

# Features

- Each microservices has its own functionality and communicate with each other via amqp to deliver good user experience
- API-Gateway acts a proxy that receives request from client and forwards to other microservices and vice versa
- Rate-limiting implementation for each microservices to protect from DDOS and other malicious attacks
- Reduce server exposure to web vulnerabilities using Helmet
- Implementation of caching in post and search service to reduce latency and improve user experience
- Media files are uploaded via multer and saved in Cloudinary as well as creating a record in MongoDB
- Communication between microservices using RabbitMQ as message broker
- Each microservice run in its own container and works together in docker compose multi container service
- Each activities and errors are logged using winston logger service for monitoring and debugging purpose

# Microservices

Each microservices has it's own README file:

- API-Gateway
- Identity-service
- Post-service
- Media-service
- Search-service

# App Usage

1. Build docker-images for all microservices:
   docker compose Build
2. Start multi-container service:
   docker compose up
3. Start each service individually:
   cd "microservice"
   npm run start

# Environment Variables 

- MONGODB_URI = {{MongoDB URL}}
- RABBITMQ_URL = amqp://localhost:5672
- REDIS_URL = redis://localhost:6379
- CLOUD_NAME = {{Cloudinary cloud name}}
- CLOUDINARY_API_KEY = {{Cloudinary API key}}
- CLOUDINARY_API_SECRET = {{Cloudinary API secret}}
- API_ENV_VAR = CLOUDINARY_URL=cloudinary://941144463585139:X6SS9UiCYrkMhiGPUeJvnQMEs9Y@dfivkrfxg

# Folder Structure

## Root Folder

NodeJS-Microservices/
|_ API-Gateway
|_ Identity-service
|_ Media-service
|_ Post-service
|_ Search-service
|_ .gitignore
|_ docker-compose.yaml
|_ README.txt

## Microservice Folder Structure

microservice/
|--- node_modules/
|--- src/
| |--- controllers/
| |--- routes/
| |--- middlewares/
| |--- models/
| |--- utils/
| |--- microservice-server.js
|--- .dockerignore
|--- .env
|--- .env.example
|--- combined-logs.log
|--- error-logs.log
|--- Dockerfile(to create Docker image)
|--- package-lock.json
|--- package.json
|--- README.md


# Issues
- rabbitmq service faced EACCES(permission denied). Possible causes:
   * Volume mounted with wrong ownership
   * Cookie file permissions are wrong
   * Reusing old RabbitMQ data (our service don't mount volumes, but Docker might have mounted anonymous volume)

# Troubleshooting
## Remove service volume if there is any (FAILED)
- Stop service and remove all volumes attached `docker compose down --volumes`
- Restart service `docker compose up --build`

## Check if there is any issues with rabbitmq image
- Start a container with the rabbitmq:3-management image `docker run -rm rabbitmq:3-management`
- RabbitMQ starts successfully in 27 seconds without any error

## Start rabbitmq service in compose project
- Start rabbitmq service `docker compose up rabbitmq --build` separately before starting other services
- RabbitMQ starts normally
