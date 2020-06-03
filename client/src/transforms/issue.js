export const addIssueTransform = data => {
  const {
    projectId,
    type,
    summary,
    description,
    status,
    reporterId,
    assigneeId,
    priority,
    points,
    labels,
  } = data;

  const updatedLabels =
    labels &&
    labels.map(label => {
      const updatedLabel = {};
      const { value, __isNew__: isNew } = label;
      updatedLabel.value = value;
      if (isNew) {
        updatedLabel.isNew = true;
      }
      return updatedLabel;
    });

  return {
    projectId,
    type,
    summary,
    description,
    status,
    reporterId,
    assigneeId,
    priority,
    points,
    labels: updatedLabels,
  };
};

export const updateIssueTransform = data => {
  const {
    id,
    sprintId,
    projectId,
    type,
    summary,
    description,
    status,
    assigneeId,
    priority,
    points,
    // labels,
  } = data;

  // const updatedLabels =
  //   labels &&
  //   labels.map(label => {
  //     const updatedLabel = {};
  //     const { value, __isNew__: isNew } = label;
  //     updatedLabel.value = value;
  //     if (isNew) {
  //       updatedLabel.isNew = true;
  //     }
  //     return updatedLabel;
  //   });

  return {
    id,
    sprintId,
    projectId,
    type,
    summary,
    description,
    status,
    assigneeId,
    priority,
    points,
    // labels: updatedLabels,
  };
};
