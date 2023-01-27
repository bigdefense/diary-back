# Common build stage
FROM nginx:1.19.6-alpine

RUN apk add --no-cache openssl


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
