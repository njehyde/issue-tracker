FROM mongo:latest

COPY init.js /init.js

CMD mongo "mongodb://$MONGODB_HOST:$MONGODB_PORT/issue-tracker" init.js
