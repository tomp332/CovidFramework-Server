FROM node:16.2.0
WORKDIR /covidframework-server
COPY package.json .
RUN npm config set strict-ssl false
RUN npm config update-notifier false
RUN npm install --silent ignore-warnings
COPY . .
EXPOSE 3000
ENTRYPOINT ["npm","start"]
