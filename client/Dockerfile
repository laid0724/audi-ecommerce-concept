FROM node:alpine AS build
WORKDIR /usr/src/app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build:docker

FROM nginx:alpine
COPY --from=build /usr/src/app/dist/public /usr/share/nginx/html
COPY --from=build /usr/src/app/dist/sys /usr/share/nginx/html/sys
COPY ./config/nginx.conf /etc/nginx/nginx.conf
