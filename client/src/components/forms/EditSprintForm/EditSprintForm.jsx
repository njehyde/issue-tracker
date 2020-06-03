import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Flex, Box } from 'rebass';

import TextareaField from 'components/core/TextareaField';
import TextField from 'components/core/TextField';
import { Button } from 'components/styled';

const EditSprintForm = ({
  errors,
  formData,
  formRefs,
  onCancel,
  onChange,
  onSubmit,
}) => {
  useEffect(() => {
    if (formRefs?.name?.current) {
      formRefs.name.current.focus();
    }
  }, [formRefs?.name?.current]);

  return (
    <form
      autoComplete="off"
      noValidate
      onSubmit={event => {
        event.preventDefault();
        onSubmit();
      }}
    >
      <Flex width={2 / 3} mb="1rem">
        <Box width={1}>
          <TextField
            ref={formRefs.name}
            name="name"
            type="text"
            label="Sprint name"
            placeholder="Enter sprint name"
            value={formData.name}
            required
            error={errors.name}
            onChange={event => onChange('name', event.target.value)}
          />
        </Box>
      </Flex>
      <Flex width={1} mb="2rem">
        <Box width={1}>
          <TextareaField
            ref={formRefs.goal}
            name="goal"
            label="Goal"
            placeholder="Enter goal"
            value={formData.goal}
            rows="6"
            error={errors.goal}
            onChange={event => onChange('goal', event.target.value)}
          />
        </Box>
      </Flex>
      <Flex justifyContent="center">
        <Button type="submit" primary invert>
          Submit
        </Button>
        <Box ml="0.5rem">
          <Button type="button" onClick={onCancel}>
            Cancel
          </Button>
        </Box>
      </Flex>
    </form>
  );
};

EditSprintForm.propTypes = {
  errors: PropTypes.objectOf(PropTypes.any).isRequired,
  formData: PropTypes.objectOf(PropTypes.any).isRequired,
  formRefs: PropTypes.objectOf(PropTypes.any).isRequired,
  onCancel: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default EditSprintForm;
