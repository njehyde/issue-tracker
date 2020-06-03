import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { Flex, Box, Image } from 'rebass';

import { Button, Input, Textarea } from 'components/styled';

import Styled from './styled';

const defaultComment = {
  text: '',
};

const AddCommentPanel = ({
  user,
  commentBeingEdited,
  onAdd,
  onChange,
  onSave,
}) => {
  const textareaRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  });

  return (
    <Flex mt="4">
      <Box>
        <Image
          width="32"
          height="32"
          src={`https://api.adorable.io/avatars/100/${user?.id}`}
          sx={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
          }}
        />
      </Box>
      <Box ml="2" flex="1 1 auto">
        {(!commentBeingEdited || commentBeingEdited.id) && (
          <Input
            placeholder="Add a comment"
            onFocus={() => onAdd({ ...defaultComment })}
          />
        )}
        {commentBeingEdited && !commentBeingEdited.id && (
          <>
            <Box>
              <Textarea
                ref={textareaRef}
                placeholder="Enter description"
                name="description"
                value={commentBeingEdited?.text}
                onChange={event => onChange(event.target.value)}
                required
                rows="6"
              />
            </Box>
            <Styled.ButtonGroup mt="0.5rem" alignSelf="flex-end">
              <Button type="button" primary invert onClick={() => onSave()}>
                Save
              </Button>
              <Button type="button" onClick={() => onAdd(null)}>
                Cancel
              </Button>
            </Styled.ButtonGroup>
          </>
        )}
      </Box>
    </Flex>
  );
};

AddCommentPanel.propTypes = {
  user: PropTypes.objectOf(PropTypes.any).isRequired,
  commentBeingEdited: PropTypes.objectOf(PropTypes.any),
  onAdd: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};

export default AddCommentPanel;
