FROM node:18-alpine

WORKDIR /app

# Copia el certificado SSL (generado en el workflow)
COPY certs/ca.pem /app/certs/

# Copia el código
COPY package*.json ./
COPY public/ ./public/
COPY server.js ./

RUN npm install --production

EXPOSE 8900
CMD ["node", "server.js"]
