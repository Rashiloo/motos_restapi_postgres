FROM node:20-alpine

WORKDIR /app

# Instala dependencias SSL
RUN apk add --no-cache openssl

# Primero copia solo lo necesario para instalar dependencias
COPY package*.json ./
RUN npm install --production

COPY certs/root.crt /etc/ssl/certs/
RUN chmod 644 /etc/ssl/certs/root.crt

# Luego copia el resto de archivos
COPY . .

# Asegura que la carpeta certs exista (si aún la necesitas)
RUN mkdir -p /app/certs

# Variables de entorno
ENV NODE_ENV=production \
    PORT=8900

EXPOSE 8900
CMD ["node", "index.js"]
