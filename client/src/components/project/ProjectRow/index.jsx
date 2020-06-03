import React from 'react';
import PropTypes from 'prop-types';
import { Flex, Box } from 'rebass';

import Styled from './styled';

const ProjectRow = ({ project, onClick }) => (
  <Styled.Card onClick={() => onClick(project)}>
    <Flex px={3} py={1}>
      <Box width={1 / 3} pr="2">
        {project.name} ({project.key})
      </Box>
      <Box width={2 / 3} px="2">
        {project.description}
      </Box>
    </Flex>
  </Styled.Card>
);

ProjectRow.propTypes = {
  project: PropTypes.objectOf(PropTypes.any).isRequired,
  onClick: PropTypes.func.isRequired,
};

export default ProjectRow;
