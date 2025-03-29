# para correr esto en local usa
# docker build -t mi-backend-local .                                                 
# docker run -d -p 3001:3001 --env PORT=3001 --name mi-backend-container mi-backend-local:latest

# Use the official Node.js image as the base image
FROM node:16

# Set the working directory
WORKDIR /app

# Copy the rest of the application code
COPY . .

# Install dependencies
RUN npm install

# Compile TypeScript to JavaScript
RUN npm run build

# Expose the application port
EXPOSE 3001

# Start the application
CMD ["npm", "start"]