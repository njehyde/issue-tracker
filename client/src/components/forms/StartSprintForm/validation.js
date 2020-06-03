import { object, string } from 'yup';

const validationSchema = object().shape({
  name: string().nullable().required('Sprint name is missing'),
  startAt: string().nullable(),
  endAt: string().nullable(),
  goal: string().nullable(),
});

export default validationSchema;
