FROM debian:bullseye

# 1. Instala dependencias
RUN apt-get update && \
    apt-get install -y curl make g++ && \
    curl -sL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y nodejs && \
    rm -rf /var/lib/apt/lists/*

# 2. Copia el proyecto
COPY . /app
WORKDIR /app
RUN npm install --production

EXPOSE 8900
CMD ["node", "index.js"]
