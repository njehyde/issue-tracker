import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Flex, Box } from 'rebass';

import DateRangeField from 'components/core/DateRangeField';
import LookupField from 'components/core/LookupField';
import TextareaField from 'components/core/TextareaField';
import TextField from 'components/core/TextField';
import { Button } from 'components/styled';
import { sprintDurationOptions } from 'constants/project';

const StartSprintForm = ({
  errors,
  formData,
  formRefs,
  onChange,
  onSubmit,
  onCancel,
}) => {
  const [hasFormHadInitialFocus, setHasFormHadInitialFocus] = useState(false);

  useEffect(() => {
    if (formRefs?.name?.current && hasFormHadInitialFocus) {
      formRefs.name.current.focus();
      setHasFormHadInitialFocus(true);
    }
  }, [formRefs?.name?.current]);

  const datesDisabled = formData.duration > 0;

  return (
    <form
      autoComplete="off"
      noValidate
      onSubmit={event => {
        event.preventDefault();
        onSubmit();
      }}
    >
      <Flex width={1} mb="1rem">
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
      <Flex width={1 / 2} mb="1rem">
        <Box width={1}>
          <LookupField
            ref={formRefs.duration}
            name="duration"
            label="Duration"
            options={sprintDurationOptions}
            value={formData.duration}
            required
            error={errors.duration}
            onChange={value => onChange('duration', value)}
          />
        </Box>
      </Flex>
      <Flex width={3 / 4} mb="1rem">
        <Box width={1}>
          <DateRangeField
            range
            disabled={datesDisabled}
            startProps={{
              ref: formRefs.startAt,
              name: 'startAt',
              label: 'Start date',
              placeholder: 'Enter start date',
              value: formData.startAt,
              required: true,
              error: errors.startAt,
              onChange: date => onChange('startAt', date),
            }}
            endProps={{
              ref: formRefs.endAt,
              name: 'endAt',
              label: 'End date',
              placeholder: 'Enter end date',
              value: formData.endAt,
              required: true,
              error: errors.endAt,
              onChange: date => onChange('endAt', date),
            }}
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
            value={formData.goal || ''}
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
StartSprintForm.propTypes = {
  errors: PropTypes.objectOf(PropTypes.any),
  formRefs: PropTypes.objectOf(PropTypes.any).isRequired,
  formData: PropTypes.objectOf(PropTypes.any).isRequired,
  onCancel: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default StartSprintForm;
