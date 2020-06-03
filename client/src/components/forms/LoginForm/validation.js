import { object, string } from 'yup';

const validationSchema = object().shape({
  email: string()
    .email('Must be a valid email')
    .nullable()
    .required('Email is missing'),
  password: string().nullable().required('Password is missing'),
});

export default validationSchema;
