import React from 'react';
import { useHistory } from 'react-router-dom';

import { defaultUserProjectChangesMessage } from 'constants';

import Styled from './styled';

const ProjectChangeNotification = () => {
  const history = useHistory();
  return (
    <div>
      {defaultUserProjectChangesMessage}
      &nbsp;
      <Styled.Reload onClick={() => history.go()}>Reload</Styled.Reload>
    </div>
  );
};

export default ProjectChangeNotification;
