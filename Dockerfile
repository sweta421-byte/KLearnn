FROM node:20-alpine
WORKDIR /app
RUN npm install -g @nestjs/cli prisma
COPY services/backend/package.json ./
RUN npm install --ignore-scripts
COPY services/backend/src/prisma ./src/prisma
RUN prisma generate --schema=./src/prisma/schema.prisma
COPY services/backend/ ./
RUN npm run build
EXPOSE 3001
CMD ["node", "dist/main"]
