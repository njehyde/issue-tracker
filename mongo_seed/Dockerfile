FROM mongo:latest

# COPY project_types.json /project_types.json
COPY init.js /init.js

CMD mongo --host mongodb issue-tracker init.js