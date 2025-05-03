FROM debian:bullseye

# Instala solo lo esencial
RUN apt-get update && \
    apt-get install -y curl make g++ && \
    curl -sL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y nodejs && \
    rm -rf /var/lib/apt/lists/*

# Copia certificado SSL
COPY certs/ca.pem /certs/

# Copia proyecto
COPY . /app
WORKDIR /app
RUN npm install

EXPOSE 8900
CMD ["node", "index.js"]
