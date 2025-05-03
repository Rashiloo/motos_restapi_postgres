# Imagen base oficial de Node.js
FROM node:18

# Crear y establecer el directorio de trabajo
WORKDIR /app

# Copiar archivos necesarios del proyecto
COPY package*.json ./
COPY index.js ./
COPY root.crt ./  # Este es tu certificado

# Instalar dependencias
RUN npm install --omit=dev

# Establecer variable de entorno para producción
ENV NODE_ENV=production

# Exponer el puerto en el que corre la app (ajusta si usas otro)
EXPOSE 8900

# Comando para iniciar la aplicación
CMD ["node", "index.js"]

