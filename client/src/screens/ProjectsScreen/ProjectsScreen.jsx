import React, { useState } from 'react';
import PropTypes from 'prop-types';
// import styled from 'styled-components';
// import { Flex } from 'rebass';

import Modal from 'components/core/Modal';
import AddProjectForm from 'components/forms/AddProjectForm';
import ScreenLayout from 'components/layout/ScreenLayout';
// import ProjectCard from 'components/project/ProjectCard';
import ProjectRow from 'components/project/ProjectRow';
import { Button } from 'components/styled';

const ProjectsScreen = ({ projects, onAddProject, onSelectProject }) => {
  const [showModal, setShowModal] = useState(false);

  const createProjectButton = (
    <Button
      key="createProjectButton"
      type="button"
      primary
      invert
      onClick={() => setShowModal(true)}
    >
      Create project
    </Button>
  );

  return (
    <>
      <ScreenLayout
        title="Projects"
        breadcrumbs={[{ path: '/projects', title: 'Projects' }]}
        actions={[createProjectButton]}
      >
        {/* <Flex width={1}>
          {projects && projects.map(project => <ProjectCard project={project} />)}
        </Flex> */}
        {/* <Flex width={1}> */}
        <div>
          {projects &&
            projects.map(project => (
              <ProjectRow
                key={project?.id}
                project={project}
                onClick={onSelectProject}
              />
            ))}
          {/* </Flex> */}
        </div>
      </ScreenLayout>
      {showModal && (
        <Modal
          l
          title="Create project"
          show={showModal}
          closeModal={() => setShowModal(!showModal)}
        >
          <AddProjectForm
            onSubmit={project => {
              onAddProject(project);
              setShowModal(false);
            }}
            onCancel={() => setShowModal(false)}
          />
        </Modal>
      )}
    </>
  );
};

ProjectsScreen.propTypes = {
  projects: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.any)),
  onAddProject: PropTypes.func.isRequired,
  onSelectProject: PropTypes.func.isRequired,
};

export default ProjectsScreen;
