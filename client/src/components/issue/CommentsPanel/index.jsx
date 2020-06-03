import React from 'react';
import PropTypes from 'prop-types';

import CommentCard from 'components/issue/CommentCard';

import AddCommentPanel from './AddCommentPanel';
import Styled from './styled';

const CommentsPanel = ({
  user,
  comments = [],
  commentBeingEdited,
  onAdd,
  onChange,
  onSave,
  ...otherProps
}) => {
  return (
    <Styled.CommentsPanel>
      <h2>Comments</h2>
      <div>
        {comments.map(comment => (
          <CommentCard
            key={comment?.id}
            comment={comment}
            commentBeingEdited={commentBeingEdited}
            onChange={onChange}
            {...otherProps}
          />
        ))}
      </div>
      <AddCommentPanel
        user={user}
        commentBeingEdited={commentBeingEdited}
        onAdd={onAdd}
        onChange={onChange}
        onSave={onSave}
      />
    </Styled.CommentsPanel>
  );
};

CommentsPanel.propTypes = {
  comments: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.any)),
  commentBeingEdited: PropTypes.objectOf(PropTypes.any),
  user: PropTypes.objectOf(PropTypes.any).isRequired,
  onAdd: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
};

export default CommentsPanel;
