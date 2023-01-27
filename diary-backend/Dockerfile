# Common build stage
FROM node:15

COPY . ./app

WORKDIR /app

RUN npm install


EXPOSE 3000

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
