### STAGE 1: Build ###
FROM node:18.17.1-alpine AS build
WORKDIR /usr/src/app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build-dev

### STAGE: Run ###
FROM nginx:1.25.2-alpine
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=build /usr/src/app/dist/wood-market /usr/share/nginx/html
EXPOSE 80