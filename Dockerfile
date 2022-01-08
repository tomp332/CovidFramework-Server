#First stage
FROM node:16 as build
WORKDIR /covidframework-server
# Copy necessary files
COPY package.json .
#Install packages
RUN npm install -g npm@latest
RUN npm config set strict-ssl false
RUN npm install --silent ignore-warnings

# Second stage
FROM nikolaik/python-nodejs:python3.7-nodejs16-slim
RUN useradd -ms /bin/bash server
RUN pip3 install pycryptodomex
WORKDIR /covidframework-server
COPY server.js .
COPY .env .
COPY ./Server/ ./Server
COPY ./package.json .
COPY --from=build /covidframework-server/node_modules /covidframework-server/node_modules/
RUN chown -R server:server /covidframework-server
RUN chmod 755 /covidframework-server
USER server
# Main
EXPOSE 3000
ENTRYPOINT ["npm","start"]