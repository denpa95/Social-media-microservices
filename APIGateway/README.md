# Overview

- API-Gateway server acts as a proxy server that receives request from client perform tasks/changes before forwarding them to other microservices.

# Features

- Every request from client first passes through API-Gateway which uses proxy middleware to modify request URL and insert required header before being forwarded to targeted microservice server.
- For requests that require authentication(eg. Post-service), a token validation middleware is used to validate access token(JWT token) sent in the request. Once token is authenticated, the payload is forwarded to the microservices with the request
- Logs all activities, warnings, and errors for monitoring and debugging purposes.

# Tech Stack

- Node.js
- Express (web server framework)
- express-http-proxy (proxy middleware)
- Redis (caching & rate-limiting)
- jsonwebtoken (authentication)

# Environment Variables

- PORT=3000
- NODE_ENV=development
- JWT_SECRET_KEY=1FDIjLpl6u+KBcz3Y/uJUNtBVoVJL9eSZNUB3hGDsdA=
- REDIS_URL=redis://localhost:6379
- IDENTITY_SERVICE_URL=http://localhost:3001
- POST_SERVICE_URL=http://localhost:3002
- MEDIA_SERVICE_URL=http://localhost:3003
- SEARCH_SERVICE_URL=http://localhost:3004

# Endpoints

- Identity-service endpoint:
  -http://localhost:3000/v1/auth
- Post-service endpoint:
  -http://localhost:3000/v1/posts
- Search-service endpoint:
  -http://localhost:3000/v1/search
- Media-service endpoint:
  -http://localhost/3000/v1/media

# Workflow

## Proxy middleware

1. Client sends request to server to perform tasks(login, create new post, upload media)
2. If user authentication(login) is required, token authentication is done and **payload** is sent together with request to proxy
3. API-Gateway receives request and apply proxy middleware to incoming request to transform gateway URL to microservice URL
4. Additional headers are added to request along **x-user-id** header which contains user ID obtain from payload forwarded
5. Any response from server passes through proxy before being forwarded to client

# Usage

## Local

1. Clone the repository
2. Navigate to project directory
3. Open terminal and run `npm install` to install required packages
4. Run `npm start` to start server

## Docker Container

1. Clone the repository
2. Run command `docker compose build api-gateway` to build api-gateway docker image image.
3. Run command `docker compose up api-gateway` to start api-gateway along with its dependencies

# Issues & Troubleshooting

- No issues currently. Any issues along with troubleshooting methods can be added in future
