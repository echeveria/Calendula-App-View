FROM node:22

WORKDIR /app

# Копиране на package.json и pnpm-lock.yaml (ако ползваш pnpm)
COPY package.json ./
COPY pnpm-lock.yaml ./

# Инсталиране на зависимости
RUN npm install -g pnpm
RUN pnpm install

# Копиране на останалия код
COPY . .

# Build client и server
RUN pnpm run build.server

# Експониране на порт (например 3042)
EXPOSE 3042

# Стартиране на Fastify сървъра
CMD ["node", "server/entry.fastify"]
