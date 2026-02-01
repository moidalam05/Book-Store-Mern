FROM node:24-alpine

WORKDIR /app

# pehle sirf dependency files
COPY package*.json ./

# yahin node_modules banega (container ke andar)
RUN npm install --omit=dev

# ab actual source code
COPY . .

EXPOSE 5000

CMD ["node", "index.js"]
