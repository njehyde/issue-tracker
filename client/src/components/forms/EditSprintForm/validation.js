import { object, string } from 'yup';

const validationSchema = object().shape({
  name: string().nullable().required('Sprint name is missing'),
  goal: string().nullable(),
});

export default validationSchema;
