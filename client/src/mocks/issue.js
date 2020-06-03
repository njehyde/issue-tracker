export const backlogIssue1 = {
  id: '5eaedb033f94c225e44d79a2',
  projectId: '5e9f6c7a1510ec4fb4d69d46',
  projectRef: 'AA-1',
  type: 'TASK',
  summary: 'Backlog issue 1',
  description: 'Backlog issue 1 description',
  status: 'BACKLOG',
  priority: 'LOW',
  points: 2,
  ordinal: 1,
  createdAt: '2020-05-03T14:53:55.658Z',
  updatedAt: '2020-05-03T17:43:56.139Z',
  reporterId: '5e8731ab46a9919e14a10c87',
  assigneeId: '5e8731ab46a9919e14a10c87',
};

export const backlogIssue2 = {
  id: '5eaedbcb3f94c225e44d79a3',
  projectId: '5e9f6c7a1510ec4fb4d69d46',
  projectRef: 'AA-2',
  type: 'TASK',
  summary: 'Backlog issue 2',
  description: 'Backlog issue 2 description',
  status: 'BACKLOG',
  priority: 'MEDIUM',
  points: 5,
  ordinal: 2,
  createdAt: '2020-05-03T14:53:55.658Z',
  updatedAt: '2020-05-03T17:43:56.139Z',
  reporterId: '5e8731ab46a9919e14a10c87',
  assigneeId: '5e8731ab46a9919e14a10c87',
};

export const backlogIssue3 = {
  id: '5e9f6ce41510ec4fb4d69d47',
  projectId: '5e9f6c7a1510ec4fb4d69d46',
  projectRef: 'AA-3',
  type: 'TASK',
  summary: 'Backlog issue 3',
  description: 'Backlog issue 3 description',
  status: 'BACKLOG',
  priority: 'HIGH',
  points: 8,
  ordinal: 3,
  createdAt: '2020-05-03T14:53:55.658Z',
  updatedAt: '2020-05-03T17:43:56.139Z',
  reporterId: '5e8731ab46a9919e14a10c87',
  assigneeId: '5e8731ab46a9919e14a10c87',
};

export const sprintIssue1 = {
  id: '5ea16480b172b550ebfa2335',
  projectId: '5e9f6c7a1510ec4fb4d69d46',
  projectRef: 'AA-1',
  type: 'TASK',
  summary: 'Sprint issue 1',
  description: 'Sprint issue 1 description',
  status: 'SELECTED_FOR_DEVELOPMENT',
  sprintId: '5eb023c3c479617b64d457a5',
  priority: 'LOW',
  points: 2,
  ordinal: 1,
  createdAt: '2020-05-03T14:53:55.658Z',
  updatedAt: '2020-05-03T17:43:56.139Z',
  reporterId: '5e8731ab46a9919e14a10c87',
  assigneeId: '5e8731ab46a9919e14a10c87',
};

export const sprintIssue2 = {
  id: '5ea16f81b172b550ebfa2338',
  projectId: '5e9f6c7a1510ec4fb4d69d46',
  projectRef: 'AA-2',
  type: 'TASK',
  summary: 'Sprint issue 2',
  description: 'Sprint issue 2 description',
  status: 'IN_PROGRESS',
  sprintId: '5eb023c3c479617b64d457a5',
  priority: 'LOW',
  points: 2,
  ordinal: 2,
  createdAt: '2020-05-03T14:53:55.658Z',
  updatedAt: '2020-05-03T17:43:56.139Z',
  reporterId: '5e8731ab46a9919e14a10c87',
  assigneeId: '5e8731ab46a9919e14a10c87',
};

export const sprintIssue3 = {
  id: '5ea1ab71b172b550ebfa2339',
  projectId: '5e9f6c7a1510ec4fb4d69d46',
  projectRef: 'AA-3',
  type: 'TASK',
  summary: 'Sprint issue 3',
  description: 'Sprint issue 3 description',
  status: 'DONE',
  sprintId: '5eb023c3c479617b64d457a5',
  priority: 'LOW',
  points: 2,
  ordinal: 3,
  createdAt: '2020-05-03T14:53:55.658Z',
  updatedAt: '2020-05-03T17:43:56.139Z',
  reporterId: '5e8731ab46a9919e14a10c87',
  assigneeId: '5e8731ab46a9919e14a10c87',
};

export const issueComment1 = {
  id: '5eabfb71f35b82f78d346545',
  text: 'Comment 1',
  createdBy: {
    id: '5e8731ab46a9919e14a10c87',
    email: 'test@test.com',
    name: {
      firstName: 'Dolores',
      lastName: 'Abernathy',
    },
  },
  createdAt: '2020-05-01T10:35:29.886Z',
  updatedAt: '2020-05-03T12:45:11.908Z',
};

export const issueComment2 = {
  id: '5eaed9303f94c225e44d79a0',
  text: 'Comment 2',
  createdBy: {
    id: '5e8731ab46a9919e14a10c87',
    email: 'test@test.com',
    name: {
      firstName: 'Dolores',
      lastName: 'Abernathy',
    },
  },
  createdAt: '2020-05-03T14:46:08.164Z',
  updatedAt: '2020-05-03T14:46:08.164Z',
};

export const issueComment3 = {
  id: '5eaf086566e225086508ef93',
  text: 'Comment 3',
  createdBy: {
    id: '5e89d312172cd2f16f3fb07a',
    email: 'bernard.lowe@test.com',
    name: {
      firstName: 'Dolores',
      lastName: 'Abernathy',
    },
  },
  createdAt: '2020-05-03T18:07:33.364Z',
  updatedAt: '2020-05-03T18:07:33.364Z',
};

export const issuesMetadata = {
  pagination: {
    pageSize: 10,
    cursor: '5ebeb215378f434265fdd9ef',
  },
  count: 6,
};

export const issueCommentsMetadata = {
  pagination: {
    pageSize: 10,
    cursor: '5eaf088066e225086508ef94',
  },
  count: 4,
};

export const issueStatuses = [
  {
    id: 'BACKLOG',
    name: 'Backlog',
    description: 'The issue is in the backlog.',
    category: 'TODO',
    ordinal: 0,
    default: true,
  },
  {
    id: 'SELECTED_FOR_DEVELOPMENT',
    name: 'Selected for development',
    description: 'The issue has been selected for development.',
    category: 'TODO',
    ordinal: 1,
    default: false,
  },
  {
    id: 'IN_PROGRESS',
    name: 'In progress',
    description:
      'This issue is being actively worked on at the moment by the assignee.',
    category: 'IN_PROGRESS',
    ordinal: 2,
    default: false,
  },
];

export const issueTypes = [
  {
    id: 'BUG',
    name: 'Bug',
    description: 'A problem or error.',
    default: false,
  },
  {
    id: 'EPIC',
    name: 'Epic',
    description: 'A big user story that needs to be broken down.',
    default: false,
  },
  {
    id: 'STORY',
    name: 'Story',
    description: 'Functionality or a feature expressed as a user goal.',
    default: false,
  },
  {
    id: 'TASK',
    name: 'Task',
    description: 'A small, distinct piece of work.',
    default: true,
  },
];

export const priorityTypes = [
  {
    id: 'HIGHEST',
    name: 'Highest',
    description: 'This problem will block progress.',
    color: '#d04437',
    ordinal: 0,
    default: false,
  },
  {
    id: 'HIGH',
    name: 'High',
    description: 'Serious problem that could block progress.',
    color: '#f15C75',
    ordinal: 1,
    default: false,
  },
  {
    id: 'MEDIUM',
    name: 'Medium',
    description: 'Has the potential to affect progress.',
    color: '#f79232',
    ordinal: 2,
    default: true,
  },
  {
    id: 'LOW',
    name: 'Low',
    description: 'Minor problem or easily worked around.',
    color: '#707070',
    ordinal: 3,
    default: false,
  },
  {
    id: 'LOWEST',
    name: 'Lowest',
    description: 'Trivial problem with little or no impact on progress.',
    color: '#999999',
    ordinal: 4,
    default: false,
  },
];

export const issueOrdinals = [
  {
    id: '5ea1ab71b172b550ebfa2339',
    ordinal: 0,
  },
  {
    id: '5ea16f81b172b550ebfa2338',
    ordinal: 1,
  },
  {
    id: '5eaedb033f94c225e44d79a2',
    ordinal: 2,
  },
];
