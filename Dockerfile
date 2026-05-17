FROM node:20-alpine
WORKDIR /app
COPY services/backend/package.json ./
RUN npm install --ignore-scripts
COPY services/backend/ ./
RUN npm run build
EXPOSE 3001
CMD ["node", "dist/main"]
