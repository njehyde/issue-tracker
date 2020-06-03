import { object, string } from 'yup';
import defaultClient from 'services/defaultClient';

function keyValidation(value) {
  const { skipKeyAsyncCheck = false, isKeyValid = false } = this.options;
  if (!skipKeyAsyncCheck) {
    return defaultClient
      .head(`/check/projects?key=${value}`)
      .then(() => false)
      .catch(() => true);
  }
  return isKeyValid;
}

const validationSchema = object().shape({
  key: string()
    .nullable()
    .test('unique-key', 'This key is already taken', keyValidation)
    .required('Key is missing'),
  name: string().nullable().required('Name is missing'),
  type: string().nullable().required('Type is missing'),
  description: string().nullable(),
  leadId: string().nullable().required('Project lead is missing'),
  defaultAssigneeId: string()
    .nullable()
    .required('Default assignee is missing'),
  defaultBoardType: string().nullable().required('Board type is missing'),
});

export default validationSchema;
