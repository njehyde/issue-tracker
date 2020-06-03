// Init collections
db.createCollection("board_templates");
db.createCollection("boards");
db.createCollection("categories");
db.createCollection("issue_statuses");
db.createCollection("issue_types");
db.createCollection("issues");
db.createCollection("labels");
db.createCollection("priority_types");
db.createCollection("project_counters");
db.createCollection("project_types");
db.createCollection("projects");
db.createCollection("users");
db.createCollection("workflows");

// Init views
db.createView("projects_with_boards", "projects", [
  {
    $lookup: {
      from: "boards",
      localField: "boards",
      foreignField: "_id",
      as: "boards",
    },
  },
]);

// Upsert default categories
const categories = [
  { _id: "TODO", name: "Todo", ordinal: 0 },
  { _id: "IN_PROGRESS", name: "In progress", ordinal: 1 },
  { _id: "DONE", name: "Done", ordinal: 2 },
];
const categoriesUpdate = categories.map(({ _id, name, ordinal }) => ({
  updateOne: {
    filter: { _id },
    update: { $set: { _id, name, ordinal: NumberInt(ordinal) } },
    upsert: true,
  },
}));
db.categories.bulkWrite(categoriesUpdate);

// Upsert default issue statuses
const issueStatuses = [
  {
    _id: "BACKLOG",
    name: "Backlog",
    description: "The issue is in the backlog.",
    categoryId: "TODO",
    ordinal: 0,
    isDefault: true,
  },
  {
    _id: "SELECTED_FOR_DEVELOPMENT",
    name: "Selected for development",
    description: "The issue has been selected for development.",
    categoryId: "TODO",
    ordinal: 1,
    isDefault: false,
  },
  {
    _id: "IN_PROGRESS",
    name: "In progress",
    description:
      "This issue is being actively worked on at the moment by the assignee.",
    categoryId: "IN_PROGRESS",
    ordinal: 2,
    isDefault: false,
  },
  {
    _id: "DONE",
    name: "Done",
    description: "The issue is done.",
    categoryId: "DONE",
    ordinal: 3,
    isDefault: false,
  },
];
const issueStatusesUpdate = issueStatuses.map(
  ({ _id, name, description, categoryId, ordinal, isDefault }) => ({
    updateOne: {
      filter: { _id },
      update: {
        $set: {
          _id,
          name,
          description,
          categoryId,
          ordinal: NumberInt(ordinal),
          isDefault,
        },
      },
      upsert: true,
    },
  })
);
db.issue_statuses.bulkWrite(issueStatusesUpdate);

// Upsert default project types
const projectTypes = [{ _id: "SOFTWARE", name: "Software" }];
const projectTypesUpdate = projectTypes.map(({ _id, name }) => ({
  updateOne: {
    filter: { _id },
    update: { $set: { _id, name } },
    upsert: true,
  },
}));
db.project_types.bulkWrite(projectTypesUpdate);

// Upsert default issue types
const issueTypes = [
  {
    _id: "BUG",
    name: "Bug",
    description: "A problem or error.",
    isDefault: false,
  },
  {
    _id: "EPIC",
    name: "Epic",
    description: "A big user story that needs to be broken down.",
    isDefault: false,
  },
  {
    _id: "STORY",
    name: "Story",
    description: "Functionality or a feature expressed as a user goal.",
    isDefault: false,
  },
  {
    _id: "TASK",
    name: "Task",
    description: "A small, distinct piece of work.",
    isDefault: true,
  },
];
const issueTypesUpdate = issueTypes.map(
  ({ _id, name, description, isDefault }) => ({
    updateOne: {
      filter: { _id },
      update: { $set: { _id, name, description, isDefault } },
      upsert: true,
    },
  })
);
db.issue_types.bulkWrite(issueTypesUpdate);

// Upsert default priority types
const priorityTypes = [
  {
    _id: "HIGHEST",
    name: "Highest",
    description: "This problem will block progress.",
    color: "#d04437",
    ordinal: 0,
    isDefault: false,
  },
  {
    _id: "HIGH",
    name: "High",
    description: "Serious problem that could block progress.",
    color: "#f15C75",
    ordinal: 1,
    isDefault: false,
  },
  {
    _id: "MEDIUM",
    name: "Medium",
    description: "Has the potential to affect progress.",
    color: "#f79232",
    ordinal: 2,
    isDefault: false,
  },
  {
    _id: "LOW",
    name: "Low",
    description: "Minor problem or easily worked around.",
    color: "#707070",
    ordinal: 3,
    isDefault: true,
  },
  {
    _id: "LOWEST",
    name: "Lowest",
    description: "Trivial problem with little or no impact on progress.",
    color: "#999999",
    ordinal: 4,
    isDefault: false,
  },
];
const priorityTypesUpdate = priorityTypes.map(
  ({ _id, name, description, color, ordinal, isDefault }) => ({
    updateOne: {
      filter: { _id },
      update: {
        $set: {
          _id,
          name,
          description,
          color,
          ordinal: NumberInt(ordinal),
          isDefault,
        },
      },
      upsert: true,
    },
  })
);
db.priority_types.bulkWrite(priorityTypesUpdate);

// Upsert default workflows
const workflows = [
  {
    _id: NumberInt(1),
    name: "Default workflow",
    isLocked: true,
    steps: [
      {
        name: "Todo",
        ordinal: 0,
        categoryId: "TODO",
        statusIds: ["BACKLOG", "SELECTED_FOR_DEVELOPMENT"],
      },
      {
        name: "In Progress",
        ordinal: 1,
        categoryId: "IN_PROGRESS",
        statusIds: ["IN_PROGRESS"],
      },
      { name: "Done", ordinal: 2, categoryId: "DONE", statusIds: ["DONE"] },
    ],
  },
];
const workflowsUpdate = workflows.map(({ _id, name, isLocked, steps }) => {
  return {
    updateOne: {
      filter: { _id },
      update: {
        $set: {
          _id,
          name,
          isLocked,
          steps: steps.map(({ name, ordinal, categoryId, statusIds }) => ({
            name,
            ordinal: NumberInt(ordinal),
            categoryId,
            statusIds,
          })),
        },
      },
      upsert: true,
    },
  };
});
db.workflows.bulkWrite(workflowsUpdate);

// Upsert default board templates
const boardTemplates = [
  {
    _id: "KANBAN",
    name: "Kanban Board",
    isSprintable: false,
    isBacklogVisible: false,
    isBoardVisible: true,
    workflowId: 1,
  },
  {
    _id: "SCRUM",
    name: "Scrum",
    isSprintable: true,
    isBacklogVisible: true,
    isBoardVisible: true,
    workflowId: 1,
  },
];
const boardTemplatesUpdate = boardTemplates.map(
  ({
    _id,
    name,
    isSprintable,
    isBacklogVisible,
    isBoardVisible,
    workflowId,
  }) => ({
    updateOne: {
      filter: { _id },
      update: {
        $set: {
          _id,
          name,
          isSprintable,
          isBacklogVisible,
          isBoardVisible,
          workflowId: NumberInt(workflowId),
        },
      },
      upsert: true,
    },
  })
);
db.board_templates.bulkWrite(boardTemplatesUpdate);
