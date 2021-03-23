FROM node:14-alpine AS ui-build
WORKDIR /usr/src/app
COPY atmo-ui/ ./atmo-ui/
RUN cd atmo-ui && npm install && npm run build

FROM node:14-alpine AS server-build
WORKDIR /root/
COPY --from=ui-build /usr/src/app/atmo-ui/dist ./atmo-ui/dist
COPY atmo-server/package*.json ./atmo-server/
RUN cd atmo-server && npm install
COPY atmo-server/server.js ./atmo-server/

EXPOSE 443

CMD ["node", "./atmo-server/server.js"]