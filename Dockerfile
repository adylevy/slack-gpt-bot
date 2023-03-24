FROM node:18-alpine

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies
# Bundle app source
COPY . /usr/src/app
RUN apk update && apk add bash
RUN node -v

RUN npm ci
ENV NODE_ENV production
RUN npm run build
EXPOSE 3000


CMD [ "npm", "run", "start" ]
