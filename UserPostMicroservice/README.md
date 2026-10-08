# Overview

Post service allows users to create new posts, delete selected posts, find particular post by ID, find all posts, and delete a particular post by ID.

# Features

- Authenticate user before allowing user to perform any activities related to posts
- Uses RabbitMQ to update and delete new posts in search service(acts as search engine)
- Uses RabbitMQ to update and delete media associated with a post in Media-service
- Uses Redis caching when fetching posts from database server to reduce latency.

# Tech Stack

- Node.js
- Express (web server)
- RabbitMQ (message broker)
- mongoose (ODM for MongoDB)
- MongoDB Atlas (cloud database server by MongoDB)
- Docker and Docker Compose (containerization)

# Environment Variables

- PORT=3002
- NODE_ENV=production
- MONGODB_URI=mongodb+srv://santimarez_95:santimarez_95@nodejs-microservices-cl.qexfclp.mongodb.net/
- REDIS_URL=redis://localhost:6379
- RABBITMQ_URL=amqp://localhost:5672

# Endpoints

- GET/Fetch all posts
  - http://localhost:3002/api/posts/all-posts
- GET/Fetch post by ID
  - http://localhost:3002/api/posts/get/:ID
- POST/Create new post
  - http://localhost:3002/api/posts/create-post
- DELETE/Delete post by ID
  - http://localhost:3002/api/posts/delete/:ID

# Request Workflow

## Post-creation Event

- User sends request to create a new post with content and mediaIds(array of media IDs) in request body
- User is first authenticated using access token
- After validation request body data using Joi, new post is saved in database
- A message is published and sent to Search-service to update search-service records

## Post-deletion Event

- User sends request to delete a post by including post ID in URL
- Server checks if post is available and deletes it
- Server then publish a message to search service to remove post from search collection
- Cache is also cleared to prevent deleted post from appearing in GET requests

## Fetch all posts & Fetch by ID

- User sends request to find all posts or a particular post by ID
- If user requests to find post by ID, server checks if post with the ID is available and sends it to user
- Caching is used to fetch request to reduce latency and improve user experience

# Usage

## Local

1. Clone the repository
2. Navigate to project directory
3. Open terminal and run `npm install` to install required packages
4. Run `npm run start` to start server

## Docker container

1. Clone the repository
2. Run command `docker compose build user-post-service` to build post-service docker image.
3. Run command `docker compose up user-post-service` to start post-service along with its dependencies

# Issues & Troubleshooting

## Incompatible base image

- Previously used base image(**node:alpine**) for media-service doesn't support WebCrypto Web API which MongoDB uses to secure connection. Changing the base image to **node:20-alpine** solved this issue

## Connection to RabbitMQ fail

- Connection to RabbitMQ fails and causes the app to exit with code 1 because RabbitMQ performs healthchecks and waits for it to finish to ensure service is healthy before starting to listen to request at port 5672. Changing the healthcheck.interval doesn't solve this issue as Compose can't stop, pause or delay app service connectivity. To solve the issue, connection to RabbitMQ was forcefully reattempted every 5 seconds until connection is successfully established.
