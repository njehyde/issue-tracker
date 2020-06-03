import React from 'react';
import PropTypes from 'prop-types';

import UpdateIssueForm from 'components/forms/UpdateIssueForm';
import CommentsPanel from 'components/issue/CommentsPanel';

const IssueSection = ({
  user,
  issue,
  comments,
  commentBeingEdited,
  onUpdateIssue,
  onAddComment,
  onEditComment,
  onChangeComment,
  onSaveComment,
  onUpdateComment,
  onDeleteComment,
}) => (
  <>
    <UpdateIssueForm key={issue.id} issue={issue} onSubmit={onUpdateIssue} />
    <CommentsPanel
      user={user}
      comments={comments}
      commentBeingEdited={commentBeingEdited}
      onAdd={onAddComment}
      onEdit={onEditComment}
      onChange={onChangeComment}
      onSave={onSaveComment}
      onUpdate={onUpdateComment}
      onDelete={onDeleteComment}
    />
  </>
);

IssueSection.propTypes = {
  user: PropTypes.objectOf(PropTypes.any).isRequired,
  issue: PropTypes.objectOf(PropTypes.any).isRequired,
  onUpdateIssue: PropTypes.func.isRequired,
  comments: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.any)),
  commentBeingEdited: PropTypes.objectOf(PropTypes.any),
  onAddComment: PropTypes.func.isRequired,
  onEditComment: PropTypes.func.isRequired,
  onChangeComment: PropTypes.func.isRequired,
  onSaveComment: PropTypes.func.isRequired,
  onUpdateComment: PropTypes.func.isRequired,
  onDeleteComment: PropTypes.func.isRequired,
};

export default IssueSection;
