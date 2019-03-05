FROM project.angle-tech.com.tw:8001/angle/eureka-client:0.0.3

WORKDIR /usr/src/app

RUN mkdir -p /usr/src/app/public 
ARG WEB_APP_PATH
ADD ${WEB_APP_PATH} /usr/src/app/public

ENV SERVICE_NAME=
ENV REGISTRY_URI=


CMD [ "node", "server.js"]



