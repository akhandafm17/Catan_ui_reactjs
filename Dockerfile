FROM node:19.8.1-alpine as builder
WORKDIR /app

# Copying package files separately to leverage Docker cache
COPY package.json .
COPY package-lock.json .
RUN npm install


# Copying the rest of the application files
COPY . .


# Build the Vite project
RUN npm run build



# Use a lightweight Nginx image as the final image
FROM nginx:alpine

# Copy the built files from the builder image to the Nginx web root
COPY --from=builder /app/dist /usr/share/nginx/html

COPY env.sh /docker-entrypoint.d/env.sh

# Expose port 80
EXPOSE 80

RUN chmod +x /docker-entrypoint.d/env.sh

