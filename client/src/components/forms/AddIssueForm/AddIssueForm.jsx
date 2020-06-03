import React from 'react';
import PropTypes from 'prop-types';
import { Flex, Box } from 'rebass';

import LookupField from 'components/core/LookupField';
import TextareaField from 'components/core/TextareaField';
import TextField from 'components/core/TextField';
import { Button } from 'components/styled';
import { issuePoints } from 'constants/issue';

const AddIssueForm = ({
  errors,
  formData,
  formRefs,
  issueTypes,
  priorityTypes,
  onCancel,
  onChange,
  onLoadLabels,
  onLoadProjects,
  onLoadUsers,
  onSubmit,
}) => (
  <form
    autoComplete="off"
    noValidate
    onSubmit={event => {
      event.preventDefault();
      onSubmit();
    }}
  >
    <Flex width={1} mb={2}>
      <Box width={1 / 3}>
        <LookupField
          ref={formRefs.projectId}
          isAsync
          name="projectId"
          label="Project"
          loadOptions={onLoadProjects}
          value={formData.projectId}
          autoFocus
          required
          isSearchable={false}
          error={errors.projectId}
          onChange={value => onChange('projectId', value)}
        />
      </Box>
    </Flex>
    <Flex width={1} mb={2}>
      <Box width={1 / 3}>
        <LookupField
          ref={formRefs.type}
          name="type"
          label="Type"
          options={issueTypes}
          value={formData.type}
          required
          isSearchable={false}
          error={errors.type}
          onChange={value => onChange('type', value)}
        />
      </Box>
    </Flex>
    <Flex width={1} mb={2}>
      <Box width={1}>
        <TextField
          ref={formRefs.summary}
          name="summary"
          type="text"
          label="Summary"
          placeholder="Enter summary"
          value={formData.summary}
          required
          error={errors.summary}
          onChange={event => onChange('summary', event.target.value)}
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
          ref={formRefs.reporterId}
          isAsync
          name="reporterId"
          label="Reporter"
          loadOptions={onLoadUsers}
          value={formData.reporterId}
          required
          error={errors.reporterId}
          onChange={value => onChange('reporterId', value)}
        />
      </Box>
    </Flex>
    <Flex width={1} mb={2}>
      <Box width={1 / 3}>
        <LookupField
          ref={formRefs.assigneeId}
          isAsync
          name="assigneeId"
          label="Assignee"
          loadOptions={onLoadUsers}
          value={formData.assigneeId}
          error={errors.assigneeId}
          onChange={value => onChange('assigneeId', value)}
        />
      </Box>
    </Flex>
    <Flex width={1} mb={2}>
      <Box width={1 / 3}>
        <LookupField
          ref={formRefs.type}
          name="priority"
          label="Type"
          options={priorityTypes}
          isSearchable={false}
          value={formData.priority}
          required
          error={errors.priority}
          onChange={value => onChange('priority', value)}
        />
      </Box>
    </Flex>
    <Flex width={1} mb={2}>
      <Box width={1 / 6}>
        <LookupField
          ref={formRefs.points}
          name="points"
          label="Points"
          options={issuePoints}
          isSearchable={false}
          transformOptions={p => ({ value: p, label: p })}
          value={formData.points}
          required
          error={errors.points}
          onChange={value => onChange('points', value)}
        />
      </Box>
    </Flex>
    <Flex width={1} mb={2}>
      <Box width={1 / 3}>
        <LookupField
          ref={formRefs.labels}
          isCreatable
          isMulti
          isAsync
          name="labels"
          label="Labels"
          loadOptions={onLoadLabels}
          value={formData.labels}
          error={errors.labels}
          onInputChange={value => value && value.replace(/\W/g, '')}
          onGetNewOptionData={(value, label) => ({
            label: label.toLowerCase(),
            value: value.toLowerCase(),
            __isNew__: true,
          })}
          onChange={value => onChange('labels', value)}
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

AddIssueForm.propTypes = {
  errors: PropTypes.objectOf(PropTypes.any).isRequired,
  formData: PropTypes.objectOf(PropTypes.any).isRequired,
  formRefs: PropTypes.objectOf(PropTypes.any).isRequired,
  issueTypes: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.any)).isRequired,
  priorityTypes: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.any))
    .isRequired,
  onCancel: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  onLoadLabels: PropTypes.func.isRequired,
  onLoadProjects: PropTypes.func.isRequired,
  onLoadUsers: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default AddIssueForm;
