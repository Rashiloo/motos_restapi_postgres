FROM node:20-alpine

WORKDIR /app

# Instala herramientas SSL para verificación
RUN apk add --no-cache openssl

# Copia e instala dependencias
COPY package*.json ./
RUN npm install --production

# Copia la aplicación
COPY . .

# Variables de entorno (se sobrescriben en Render)
ENV NODE_ENV=production \
    PORT=8900

EXPOSE 8900
CMD ["node", "index.js"]
