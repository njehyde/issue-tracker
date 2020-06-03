import React from 'react';
import PropTypes from 'prop-types';
import { Box, Heading } from 'rebass';

const ProjectCard = ({ project }) => (
  <Box p={3} m={2} width={1 / 4} color="white" bg="grey">
    <Heading textAlign="center" fontSize={[5, 6]}>
      {project.name}
    </Heading>
  </Box>
);

ProjectCard.propTypes = {
  project: PropTypes.objectOf(PropTypes.any),
};

export default ProjectCard;
