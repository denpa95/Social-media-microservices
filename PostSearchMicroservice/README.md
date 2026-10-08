# Overview

The search service acts as a search engine for posts created by users

# Features & Responsibilities

- Uses **RabbitMQ** to listen to **post-creation** events from **post-service** to save newly created posts in the database to be fetched when queried by user
- Search for posts using a query parameter included in URL
- Caches search results using Redis to reduce latency
- Uses **RabbitMQ** to listen to **post-deletion** events from **post-service** to delete corresponding posts from the database and invalidates the cache

# Tech Stack

- Node.js
- Express (web server)
- RabbitMQ (message broker)
- mongoose (ODM for MongoDB)
- MongoDB Atlas (cloud database service by MongoDB)
- Docker & Docker Compose (containerization)

# Environment Variables

- PORT=3004
- NODE_ENV=production
- MONGODB_URI=mongodb+srv://santimarez_95:santimarez_95@nodejs-microservices-cl.qexfclp.mongodb.net/
- REDIS_URL=redis://localhost:6379
- RABBITMQ_URL=amqp://localhost:5672

# Endpoints

- GET/Post search query
  -http://localhost:3004/api/search/posts?query=SearchQuery

# Request Workflow

## Find posts

- User sends request with **search query** in URL
- Server first checks cache if search result is available
- If not, server sends request to database server to fetch posts whose contents contains the search query as part of its content
- The response from database server is then cached to reduce latency in subsequent searches

## Post creation/deletion events

- RabbitMQ is used to listen to post creation and deletion event from post-service
- If new post is created, a message is sent via RabbitMQ to search-server. The created post ID, content, etc is then saved in the database for use by the search-service
- If a post is deleted, post-service sends a message through RabbitMQ to search-service. The deleted post's record is then deleted from database

# Usage

## Local

1. Clone the repository
2. Navigate to project directory
3. Open terminal and run `npm install` to install required packages
4. Run `npm run start` to start server

## Docker Container

1. Clone the repository
2. Run command `docker compose build post-search-service` to build search-service docker image.
3. Run command `docker compose up post-search-service` to start search-service along with its dependencies

# Issues & Troubleshooting

- Connection to Redis and RabbitMQ was not successful when initially launching multi-container. That was because during development both Redis & RabbitMQ server were **hosted on the local machine**. In docker, **each of the server runs in their own service container**. The URL for both services was modified to make connection to these service successful
- **dotenv** loads env variables from .env and **inject** them into application at **runtime** overwriting environment variables configured in Dockerfile. To resolve this issue, dotenv was configured to only **load** variables when **NODE_ENV is set to "production"**. Additionally in .yaml file, NODE_ENV for all services are set to "production".
- [RESOLVED] Search service does not return results with certain search quries such as "This", "is", etc. [UPDATE] Words such as "This", "is", "my" are stop-word in MongoDB default English text index. Thus, text indexes drops stop-word at index time and query time. This is why using these words as search query doesn't return any result. To resolve this, old text index must be dropped first before new index with no stop-word filtering is created.
