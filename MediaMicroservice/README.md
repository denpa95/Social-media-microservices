# Overview 

Media server handles all requests involving media such as media upload and fetching media from database.

# Features 

- Handles media upload request from client by using multer
- Stores uploaded media in Cloudinary
- Creates and stores new record of uploaded media in MongoDB with information returned from Cloudinary as reference
- Uses RabbitMQ as message broker to communicate with Identity-service to listen to post-deletion event to delete medias associated with the related posts
- Fetches all medias from database for client.

# Tech Stack

- Node.js
- Express (web framework)
- multer (to upload file)
- Cloudinary (cloud storage for media)
- RabbitMQ (message broker)
- mongoose (ODM for MongoDB)
- MongoDB Atlas (cloud database service by MongoDB)
- Docker & Docker compose (containerization)

# Environment Variables

- NODE_ENV=development
- PORT=3003
- MONGODB_URI=MongoDB_Atlas_connection_string
- REDIS_URL=redis://localhost:6379
- CLOUD_NAME=Cloudinary_cloud_name
- API_KEY=Cloudinary_API_key
- API_SECRET=Cloudinary_API_secret
- CLOUDINARY_URL=Cloudinary_URL
- RABBITMQ_URL=amqp://localhost:5672

# Endpoints 

- POST/Media upload endpoint:
  - http://localhost:3003/api/media/upload
- GET/Fetch all media:
  - http://localhost:3003/api/media/all-medias

# Request Workflows

## Media upload 

- User upload single file via form-data and filename "file"
- File sent with incoming request is then uploaded to Cloudinary.
- Cloudinary returns a public ID which user can use to view the media in Cloudinary storage
- The server then sends request a to MongoDB to save file record in database together with the Cloudinary public ID

## Fetch all media 

- Server sends request to MongoDB to fetch all medias uploaded
- User can use the public ID in the response to view the media in Cloudinary

## Post deletion event-handler 

- Server uses RabbitMQ to listen to post deletion event from Post-service
- If any post is deleted, post-service server sends a message with the IDs of media associated with the post
- Media server then deletes all media associated with the deleted post

# Usage 

## Local 

1. Clone the repository
2. Navigate to project directory
3. Open terminal and run `npm install` to install required packages
4. Run `npm run start` to start server

## Docker Container 

1. Clone the repository
2. Run command `docker compose build media-service` to build media-service image.
3. Run command `docker compose up media-service` to start media-service along with its dependencies

# Issues & Troubleshooting

## Incompatible base image 

- Previously used base image(**node:alpine**) for media-service doesn't support WebCrypto Web API which MongoDB uses to secure connection. Changing the base image to **node:20-alpine** solved this issue

## Connection to RabbitMQ fail 

- Connection to RabbitMQ fails and causes the app to exit with code 1 because RabbitMQ performs healthchecks and waits for it to finish to ensure service is healthy before starting to listen to request at port 5672. Changing the healthcheck.interval doesn't solve this issue as Compose can't stop, pause or delay app service connectivity. To solve the issue, connection to RabbitMQ was forcefully reattempted every 5 seconds until connection is successfully established.
