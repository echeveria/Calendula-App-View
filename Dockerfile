# База образ с Node.js
FROM node:18-alpine

WORKDIR /app

# Копиране на package.json и pnpm-lock.yaml (ако ползваш pnpm)
COPY package.json ./
COPY pnpm-lock.yaml ./

# Инсталиране на зависимости
RUN npm install

# Копиране на останалия код
COPY . .

# Build client и server
RUN npm run build.client
RUN npm run build.server

# Експониране на порт (например 3000)
EXPOSE 3000

# Стартиране на Fastify сървъра
CMD ["node", "server/entry.fastify"]
