FROM node:20-alpine
WORKDIR /app
RUN npm install -g @nestjs/cli prisma
COPY services/backend/package.json ./
COPY services/backend/src/prisma ./src/prisma
RUN npm install --ignore-scripts
RUN prisma generate --schema=./src/prisma/schema.prisma
COPY services/backend/src ./src
COPY services/backend/tsconfig*.json ./
RUN npm run build
EXPOSE 3001
CMD ["node", "dist/main"]
