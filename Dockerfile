FROM node:18-alpine

WORKDIR /app

# Copy root package files
COPY package.json package-lock.json* ./

# Copy server and client
COPY server ./server
COPY client ./client

# Install dependencies
RUN npm install
RUN cd server && npm install && cd ..
RUN cd client && npm install && cd ..

# Build
RUN npm run build

# Expose ports
EXPOSE 5000 3000

# Start both services
CMD ["sh", "-c", "npm run start &  npm run start --prefix client"]
