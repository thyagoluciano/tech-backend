# Stage 1: Base
FROM node:20-alpine AS base
WORKDIR /app
COPY package*.json ./

# Stage 2: Dependencies
FROM base AS dependencies
RUN npm install

# Stage 3: Build
FROM dependencies AS build
COPY . .
RUN npm run build

# Stage 4: Production
FROM node:20-alpine AS production
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/dist ./dist
COPY --from=build /app/package*.json ./
RUN npm install --omit=dev
EXPOSE 3000
CMD ["npm", "start"]

# Stage 5: Development
FROM dependencies AS development
WORKDIR /app
ENV NODE_ENV=development
COPY . .
EXPOSE 3000
CMD ["npm", "run", "dev"]