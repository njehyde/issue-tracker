import { array, number, object, string } from 'yup';

const validationSchema = object().shape({
  projectId: string().nullable().required('Project is missing'),
  type: string().nullable().required('Type is missing'),
  summary: string().nullable().required('Summary is missing'),
  description: string().nullable(),
  status: string().nullable().required('Status is missing'),
  reporterId: string().nullable().required('Reporter is missing'),
  assigneeId: string().nullable(),
  priority: string().nullable().required('Priority is missing'),
  points: number().nullable(),
  labels: array().nullable(),
});

export default validationSchema;
