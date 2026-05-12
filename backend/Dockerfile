FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Create data dir for SQLite (mounted as volume)
RUN mkdir -p /app/data

EXPOSE 8080

CMD node src/seed/seed.js && node src/app.js
