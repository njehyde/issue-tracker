import React from 'react';
import PropTypes from 'prop-types';
import { Flex, Box, Image } from 'rebass';

import { Button, Textarea } from 'components/styled';
import DurationLabel from 'components/core/DurationLabel';
import { getFullName } from 'utils';

import ActionItem from './ActionItem';
import Styled from './styled';

const CommentCard = ({
  comment,
  commentBeingEdited,
  onChange,
  onDelete,
  onEdit,
  onUpdate,
}) => {
  const isCommentBeingEdited =
    commentBeingEdited && comment?.id === commentBeingEdited?.id;
  return (
    <Flex pt="28px">
      <Box mr="2">
        <Image
          width="32"
          height="32"
          src={`https://api.adorable.io/avatars/100/${comment?.createdBy}`}
          sx={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
          }}
        />
      </Box>
      <Box flex="1 1 auto">
        <Flex flexDirection="column">
          <Box>
            <Flex>
              <Styled.CreatedBy>
                {getFullName(comment?.createdBy?.name)}
              </Styled.CreatedBy>
              <Styled.Duration pl="2">
                <DurationLabel dateTime={comment?.updatedAt} duration={15000} />
              </Styled.Duration>
            </Flex>
          </Box>
          {!isCommentBeingEdited && (
            <>
              <Box>
                <Styled.Text>{comment?.text}</Styled.Text>
              </Box>
              <Box>
                <ActionItem label="Edit" onClick={() => onEdit(comment)} />
                <ActionItem label="Delete" onClick={() => onDelete(comment)} />
              </Box>
            </>
          )}
          {isCommentBeingEdited && (
            <>
              <Box>
                <Textarea
                  placeholder="Enter description"
                  name="description"
                  value={commentBeingEdited?.text}
                  onChange={event => onChange(event.target.value)}
                  required
                  rows="6"
                />
              </Box>
              <Styled.ButtonGroup mt="0.5rem">
                <Button type="button" primary invert onClick={() => onUpdate()}>
                  Save
                </Button>
                <Button type="button" onClick={() => onEdit(null)}>
                  Cancel
                </Button>
              </Styled.ButtonGroup>
            </>
          )}
        </Flex>
      </Box>
    </Flex>
  );
};

CommentCard.propTypes = {
  comment: PropTypes.objectOf(PropTypes.any).isRequired,
  commentBeingEdited: PropTypes.objectOf(PropTypes.any),
  onChange: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
};

export default CommentCard;
