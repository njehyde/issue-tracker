export const addProjectTransform = data => {
  const {
    key,
    name,
    type,
    description,
    leadId,
    defaultAssigneeId,
    defaultBoardType,
  } = data;
  return {
    key,
    name,
    type,
    description,
    leadId,
    defaultAssigneeId,
    defaultBoardType,
  };
};

export const editSprintTransform = data => {
  return {
    ...data,
  };
};

export const startSprintTransform = data => {
  const { duration, ...sprint } = data;
  return {
    ...sprint,
  };
};
