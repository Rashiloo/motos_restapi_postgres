# Dockerfile
FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Copia el certificado SSL al contenedor
COPY root.crt /etc/ssl/certs/root.crt

CMD ["node", "index.js"]

