FROM node:20-bullseye-slim
RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*
WORKDIR /app
RUN npm install -g @nestjs/cli
COPY services/backend/package.json ./
COPY services/backend/src/prisma ./src/prisma
RUN npm install --ignore-scripts
ENV PRISMA_CLI_BINARY_TARGETS=debian-openssl-1.1.x
RUN ./node_modules/.bin/prisma generate --schema=./src/prisma/schema.prisma
COPY services/backend/src ./src
COPY services/backend/tsconfig*.json ./
RUN npm run build
EXPOSE 3001
CMD ["node", "dist/main.js"]
