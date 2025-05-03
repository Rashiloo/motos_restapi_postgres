FROM debian:bullseye

# 1. Instala dependencias esenciales
RUN apt-get update && \
    apt-get install -y curl make g++ openssl && \
    curl -sL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y nodejs && \
    rm -rf /var/lib/apt/lists/*

# 2. Copia el certificado SSL desde la carpeta relativa del proyecto
COPY certs/ca.pem /certs/
RUN chmod 644 /certs/ca.pem && \
    openssl x509 -in /certs/ca.pem -text -noout  # Verifica el certificado

# 3. Copia el proyecto (estructura relativa)
COPY package*.json ./
COPY public/ ./public/
COPY index.js ./

# 4. Instala dependencias y configura
RUN npm install --production

EXPOSE 8900
CMD ["node", "index.js"]
