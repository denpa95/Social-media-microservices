# Overview

Identity server handles user registrations, user login session, token renewal using refresh token, user logout requests.

# Features

- Uses MongoDB to store user credentials
- Handles new user registrations
- Handles user login request by performing user credentials authentication
- Refresh token endpoint is used to renew and obtain a new access token and refresh token. Refresh token has a expiration period of 7 days. Any request to renew refresh token upon expiry will fail and require user to login again. In case refresh token is successfully renewed(and still active), new refresh token replaces existing refresh token
- Handles user logout request by deleting user's existing refresh token

# Tech Stack

- Node.js
- Express (web framework)
- Redis (caching & rate-limiting)
- jsonwebtoken (authentication)
- mongoose (ODM for MongoDB)
- RabbitMQ (message broker)
- Docker & Docker Compose (containerization)

# Environment Variables

- PORT=3001
- NODE_ENV=production
- MONGODB_URI=mongodb+srv://santimarez_95:santimarez_95@nodejs-microservices-cl.qexfclp.mongodb.net/
- JWT_SECRET_KEY=1FDIjLpl6u+KBcz3Y/uJUNtBVoVJL9eSZNUB3hGDsdA=
- REDIS_URL=redis://localhost:6379

# Endpoints

- User registration endpoint:
  -http://localhost:3001/api/auth/register
- User login endpoint:
  -http://localhost:3001/api/auth/login
- Refresh token renewal endpoint:
  -http://localhost:3001/api/auth/refresh
- User logout endpoint:
  -http://localhost:3001/api/auth/logout

# Request Workflows

## New User Registration

- User sends request with username, email address and password in request body
- Request body data is validated using Joi
- Server runs check if given email or username has already been registered and returns 400 error response if it already exists
- User credentials are then saved(password is hashed using argon2) in database
- A response message with code 201 is sent to client indicating registration is successful

## User Login Request

- User send login request with email and password in request body
- Request body data is validated using Joi
- Server then checks if user has been registered by searching for email in database
- Server then compares given password with the hashed password
- If password is valid, access token and refresh token are generated and sent to client in response along with user ID

## Refresh Token Renewal

- Client sends request with refresh token in request body
- Request body data is validated using Joi
- Server then sends request to MongoDB to find refresh token in database and checks token expiration
- After obtaining token, server then sends request to MongoDB to find user using user ID in refresh token
- A new access token and refresh token(existing refresh token is deleted) is created and sent to client in response

## User Logout

- User sends request with refresh token in request body
- Request body data is validated by Joi
- Server then sends request to MongoDB to find and delete refresh token from database

# Usage & App Behaviour

## Local

1. Clone the repository
2. Navigate to project directory
3. Open terminal and run `npm install` to install required packages
4. Run `npm run start` to start server

## Docker Container

1. Clone the repository
2. Run command `docker compose build identity-service` to build identity-service docker image.
3. Run command `docker compose up identity-service` to start identity-service along with its dependencies

# ISSUES & TROUBLESHOOTING
- Base image have been upgraded from **node:18-alpine** to **node:20-alpine** which supports **web crypto API** used to perform secure cryptography operations during connection
- [UPDATE: 28/9/2026] Service can't start as mapped host port was reserved by host machine for internal usage. Updating the port mapping in .yaml to - "3020:3001" solved this issue