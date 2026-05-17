FROM node:20-alpine
WORKDIR /app
COPY services/backend/package.json ./
COPY services/backend/src/prisma ./src/prisma
RUN npm install --ignore-scripts
RUN npx prisma generate --schema=src/prisma/schema.prisma
COPY services/backend/ ./
RUN npm run build
EXPOSE 3001
CMD ["node", "dist/main"]
