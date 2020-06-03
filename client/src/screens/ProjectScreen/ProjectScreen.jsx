import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Route, useRouteMatch } from 'react-router-dom';

import Modal from 'components/core/Modal';
import AddIssueForm from 'components/forms/AddIssueForm';
import ScreenLayout from 'components/layout/ScreenLayout';
import Backlog from 'components/project/Backlog';
import Board from 'components/project/Board';
import Sidebar from 'components/project/Sidebar';
import { Button } from 'components/styled';

const ProjectScreen = ({ project, onAddIssue }) => {
  const { path } = useRouteMatch();
  const { defaultBoardId, boards } = project || {};
  const defaultBoard =
    boards && boards.find(board => board.id === defaultBoardId);
  const { isBacklogVisible, isBoardVisible } = defaultBoard || {};

  const [showModal, setShowModal] = useState(false);

  const createIssueButton = (
    <Button
      key="createIssueButton"
      type="button"
      primary
      invert
      onClick={() => setShowModal(true)}
    >
      Create issue
    </Button>
  );

  return (
    <>
      <ScreenLayout
        title="Project"
        sidebar={<Sidebar board={defaultBoard} />}
        breadcrumbs={[
          { path: '/projects', title: 'Projects' },
          { path: `/projects/${project?.id}`, title: project?.name },
          { path: `/projects/${project?.id}/board`, title: defaultBoard?.name },
        ]}
        actions={[createIssueButton]}
      >
        {isBacklogVisible && (
          <Route path={`${path}/backlog`}>
            <Backlog project={project} />
          </Route>
        )}
        {isBoardVisible && (
          <Route path={`${path}/board`}>
            <Board project={project} board={defaultBoard} />
          </Route>
        )}
      </ScreenLayout>
      {showModal && (
        <Modal
          l
          title="Create issue"
          show={showModal}
          closeModal={() => setShowModal(!showModal)}
        >
          <AddIssueForm
            onSubmit={issue => {
              onAddIssue(issue);
              setShowModal(false);
            }}
            onCancel={() => setShowModal(false)}
          />
        </Modal>
      )}
    </>
  );
};

ProjectScreen.propTypes = {
  project: PropTypes.objectOf(PropTypes.any),
  onAddIssue: PropTypes.func.isRequired,
};

export default ProjectScreen;
