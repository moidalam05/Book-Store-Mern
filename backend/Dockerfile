FROM node:20-alpine

WORKDIR /app
ENV NODE_ENV=production

COPY package*.json ./

RUN npm config set registry https://registry.npmjs.org/ \
 && npm set progress=false \
 && npm ci --only=production --legacy-peer-deps

COPY . .

EXPOSE 5000
CMD ["node", "index.js"]
