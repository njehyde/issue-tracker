export const addUserTransform = data => {
  const { email, password, firstName, lastName } = data;
  return {
    email,
    password,
    name: {
      firstName,
      lastName,
    },
  };
};

export default {};
