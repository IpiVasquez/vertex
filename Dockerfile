FROM node:10

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm i

COPY src ./src
COPY gulpfile.ts tsconfig.json ./
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]
