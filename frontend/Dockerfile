# NODE BLOCK
FROM node:20-alpine as nodework
WORKDIR /app
COPY package*.json .
RUN npm ci
COPY . .
RUN npm run build

# NGINX BLOCK
FROM nginx:1.29-alpine
WORKDIR /usr/share/nginx/html
RUN rm -rf ./*
COPY --from=nodework /app/dist .
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
ENTRYPOINT ["nginx", "-g", "daemon off;"]
