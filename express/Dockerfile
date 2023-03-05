FROM node:18-alpine

# RUN mkdir -p /usr/src/app/
WORKDIR /usr/src/app/

# EXPOSE 4000

COPY package*.json ./

RUN npm install

COPY . .

# CMD [ "npm", "run", "prod" ]


# FROM node:18-alpine

# WORKDIR /app

# EXPOSE 4000

# COPY package*.json ./

# RUN npm install

# COPY . .

# CMD [ "npm", "run", "dev" ]