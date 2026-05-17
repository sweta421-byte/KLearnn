FROM node:20-alpine
RUN apk add --no-cache openssl openssl-dev libc6-compat
WORKDIR /app
RUN npm install -g @nestjs/cli
COPY services/backend/package.json ./
COPY services/backend/src/prisma ./src/prisma
RUN npm install --ignore-scripts
RUN ./node_modules/.bin/prisma generate --schema=./src/prisma/schema.prisma
COPY services/backend/src ./src
COPY services/backend/tsconfig*.json ./
RUN npm run build
EXPOSE 3001
CMD ["node", "dist/main.js"]
