FROM node:18-alpine

RUN apk --no-cache add \
    gcompat \
    python3 \
    make \
    g++ \
    libpng-dev \
    jpeg-dev \
    pango-dev \
    cairo-dev \
    fontconfig \
    giflib-dev \
    ttf-freefont \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 4040

CMD ["npm", "run", "start:dev"]