FROM node:10

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm i

COPY web ./web
COPY api ./api
COPY assets ./assets
COPY gulpfile.ts tsconfig.json angular.json ./
RUN npm run build

EXPOSE $PORT
CMD ["npm", "start"]
