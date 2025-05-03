FROM node:20-alpine

WORKDIR /app

# Instala dependencias SSL
RUN apk add --no-cache openssl

# 1. Crea directorio para certificados
RUN mkdir -p /app/certs

# 2. Copia el certificado primero (para mejor caché)
COPY certs/root.crt /app/certs/
RUN chmod 644 /app/certs/root.crt

# 3. Instala dependencias
COPY package*.json ./
RUN npm install --production

# 4. Copia el resto de la aplicación
COPY . .

EXPOSE 8900
CMD ["node", "index.js"]  # Ajusta según tu archivo principal
