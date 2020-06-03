import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import ProjectChangeNotification from 'components/notifications/ProjectChangeNotification';
import { projectChangeTypes } from 'constants';
import { showInfoAlert } from 'services/notifications';

const WSTest = ({ userId, activeProjectId }) => {
  const [ws, setWs] = useState();

  const shouldAlertUserToProjectChange = (type, payload) => {
    const { userId: user, projectId } = payload || {};
    const projectChangeValues = Object.values(projectChangeTypes);

    const isChangeFromAnotherUser = userId !== user;
    const isProjectChangeType = projectChangeValues.includes(type);
    const isCurrentProject =
      isProjectChangeType && projectId && projectId === activeProjectId;

    return isChangeFromAnotherUser && isProjectChangeType && isCurrentProject;
  };

  useEffect(() => {
    if (!ws) {
      const socket = new WebSocket('ws://localhost/ws');

      // eslint-disable-next-line no-console
      console.log('Attempting Connection...');

      socket.onopen = () => {
        // eslint-disable-next-line no-console
        console.log('Successfully Connected');
        // socket.send('Hi From the Client!');
      };

      socket.onmessage = event => {
        const dataAsJson = (event && event?.data) || '';
        const data = JSON.parse(dataAsJson);
        const { type, payload } = data || {};

        if (shouldAlertUserToProjectChange(type, payload)) {
          showInfoAlert(<ProjectChangeNotification />, {
            autoClose: false,
          });
        }
      };

      socket.onclose = event => {
        // eslint-disable-next-line no-console
        console.log('Socket Closed Connection: ', event);
        // socket.send('Client Closed!');
      };

      socket.onerror = error => {
        // eslint-disable-next-line no-console
        console.log('Socket Error: ', error);
      };

      setWs(socket);
    }
  });

  return <div />;
};

WSTest.propTypes = {
  userId: PropTypes.string,
  activeProjectId: PropTypes.string,
};

const mapStateToProps = state => ({
  userId: state.authStore.user && state.authStore.user.id,
  activeProjectId: state.projectStore.activeProjectId,
});

export default connect(mapStateToProps)(WSTest);
