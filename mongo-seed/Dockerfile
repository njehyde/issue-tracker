FROM mongo:latest

COPY init.js /init.js

CMD mongo "mongodb+srv://$MONGODB_DNS_RECORD/issue-tracker" --username $MONGO_USERNAME --password $MONGO_PASSWORD init.js
