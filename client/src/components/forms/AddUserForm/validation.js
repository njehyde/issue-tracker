import { object, ref, string } from 'yup';
import defaultClient from 'services/defaultClient';

function emailValidation(value) {
  const { skipEmailAsyncCheck = false, isEmailValid = false } = this.options;
  if (!skipEmailAsyncCheck) {
    return defaultClient
      .head(`/check/users?email=${value}`)
      .then(() => false)
      .catch(() => true);
  }
  return isEmailValid;
}

const validationSchema = object().shape({
  firstName: string().nullable().required('First name is missing'),
  lastName: string().nullable().required('Last name is missing'),
  email: string()
    .email('Must be a valid email')
    .nullable()
    .test('unique-email', 'This email is already taken', emailValidation)
    .required('Email is missing'),
  password: string()
    .nullable()
    .min(8, 'Password is too short - must be 8 or more characters.')
    .max(128, 'Password is too long - must be 128 or less characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/,
      'Password must be eight characters of longer, and contain at least one lowercase, uppercase, numeric and special (!@#$%^&*) character.',
    )
    .required('Password is missing'),
  confirmPassword: string().when('password', {
    is: val => val && val.length > 0,
    then: string()
      .oneOf([ref('password')], 'Both passwords need to be the same')
      .required(),
  }),
});

export default validationSchema;
