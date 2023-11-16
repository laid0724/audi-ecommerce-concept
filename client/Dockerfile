FROM node:14.18.0-alpine AS build
WORKDIR /usr/src/app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
# RUN npm run build
# RUN npm run build:docker
COPY docker-env.sh docker-env.sh
RUN chmod u+x docker-env.sh && ./docker-env.sh

FROM nginx:alpine
COPY --from=build /usr/src/app/dist/public /usr/share/nginx/html
COPY --from=build /usr/src/app/dist/sys /usr/share/nginx/html/sys
COPY ./config/nginx.conf /etc/nginx/nginx.conf
