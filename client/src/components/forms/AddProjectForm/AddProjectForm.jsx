import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Flex, Box } from 'rebass';

import LookupField from 'components/core/LookupField';
import TextField from 'components/core/TextField';
import TextareaField from 'components/core/TextareaField';
import { Button } from 'components/styled';

const AddProjectForm = ({
  boardTypes,
  errors,
  formData,
  formRefs,
  onSubmit,
  projectTypes,
  onCancel,
  onChange,
  onLoadUsers,
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
      <Flex width={1} mb={2}>
        <Box width={1}>
          <TextField
            ref={formRefs.name}
            name="name"
            type="text"
            label="Name"
            placeholder="Enter name"
            value={formData.name}
            required
            error={errors.name}
            onChange={event => onChange('name', event.target.value)}
          />
        </Box>
      </Flex>
      <Flex width={1} mb={2}>
        <Box width={1 / 3}>
          <TextField
            ref={formRefs.key}
            name="key"
            type="text"
            label="Key"
            placeholder="Enter key"
            value={formData.key}
            required
            error={errors.key}
            onChange={event =>
              onChange('key', event.target.value.toUpperCase())
            }
          />
        </Box>
      </Flex>
      <Flex width={1} mb={2}>
        <Box width={1 / 3}>
          <LookupField
            ref={formRefs.type}
            name="type"
            label="Type"
            options={projectTypes}
            isSearchable={false}
            value={formData.type}
            required
            error={errors.type}
            onChange={value => onChange('type', value)}
          />
        </Box>
      </Flex>
      <Flex width={1} mb={2}>
        <Box width={1}>
          <TextareaField
            ref={formRefs.description}
            name="description"
            label="Description"
            placeholder="Enter description"
            value={formData.description}
            rows="6"
            error={errors.description}
            onChange={event => onChange('description', event.target.value)}
          />
        </Box>
      </Flex>
      <Flex width={1} mb={2}>
        <Box width={1 / 3}>
          <LookupField
            ref={formRefs.leadId}
            isAsync
            name="leadId"
            label="Project lead"
            loadOptions={onLoadUsers}
            value={formData.leadId}
            error={errors.leadId}
            onChange={value => onChange('leadId', value)}
          />
        </Box>
      </Flex>
      <Flex width={1} mb={2}>
        <Box width={1 / 3}>
          <LookupField
            ref={formRefs.defaultAssigneeId}
            isAsync
            name="defaultAssigneeId"
            label="Default assignee"
            loadOptions={onLoadUsers}
            value={formData.defaultAssigneeId}
            error={errors.defaultAssigneeId}
            onChange={value => onChange('defaultAssigneeId', value)}
          />
        </Box>
      </Flex>
      <Flex width={1} mb={2}>
        <Box width={1 / 3}>
          <LookupField
            ref={formRefs.type}
            name="defaultBoardType"
            label="Board type"
            options={boardTypes}
            isSearchable={false}
            value={formData.defaultBoardType}
            required
            error={errors.type}
            onChange={value => onChange('defaultBoardType', value)}
          />
        </Box>
      </Flex>
      <Flex justifyContent="center">
        <Box>
          <Button type="submit" primary invert>
            Submit
          </Button>
        </Box>
        <Box ml="0.5rem">
          <Button type="button" onClick={onCancel}>
            Cancel
          </Button>
        </Box>
      </Flex>
    </form>
  );
};

AddProjectForm.propTypes = {
  boardTypes: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.any)).isRequired,
  errors: PropTypes.objectOf(PropTypes.any),
  formData: PropTypes.objectOf(PropTypes.any).isRequired,
  formRefs: PropTypes.objectOf(PropTypes.any),
  projectTypes: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.any)).isRequired,
  onCancel: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  onLoadUsers: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default AddProjectForm;
