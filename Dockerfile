## build runner
FROM node:lts-alpine as build-runner

# Set temp directory
WORKDIR /tmp/app

# Move package.json
COPY package.json .

# Install dependencies
RUN yarn

# Move source files
COPY src ./src
COPY public ./public
COPY tsconfig.json   .

# Build project
RUN yarn build

## production runner
FROM node:lts-alpine as prod-runner

# Set work directory
WORKDIR /app

# Copy package.json from build-runner
COPY --from=build-runner /tmp/app/package.json /app/package.json

# Install dependencies
RUN yarn --production

# Move build files
COPY --from=build-runner /tmp/app/build /app/build

# Move cuppycake
COPY --from=build-runner /tmp/app/public/cuppycake.ogg /app/public/cuppycake.ogg

# Start bot
CMD [ "yarn", "start" ]
