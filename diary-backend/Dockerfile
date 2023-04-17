# Common build stage
FROM node:15

WORKDIR /usr/src/app

LABEL "purpose"="webdev"

RUN apt-get update && apt-get install -y wget

RUN apt-get install -y yarn

RUN npm install

CMD tail -f /dev/null


# Development build stage
# FROM common-build-stage as development-build-stage

# RUN chmod +x /app/docker-entrypoint.sh

# ENTRYPOINT [ "docker-entrypoint.sh" ]

# ENV NODE_ENV development

# CMD ["npm", "run", "dev"]

# # Production build stage
# FROM common-build-stage as production-build-stage

# ENV NODE_ENV production

# CMD ["npm", "run", "start"]
