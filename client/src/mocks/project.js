export const sprint1 = {
  id: '5eb023c3c479617b64d457a5',
  name: 'Sprint 1',
  ordinal: 1,
  createdAt: '2020-05-04T14:16:35.739Z',
  updatedAt: '2020-05-04T14:16:35.739Z',
  createdBy: '5e8731ab46a9919e14a10c87',
};

export const sprint2 = {
  id: '5eb023c3c479617b64d457a6',
  name: 'Sprint 2',
  ordinal: 2,
  createdAt: '2020-05-04T14:16:35.739Z',
  updatedAt: '2020-05-04T14:16:35.739Z',
  createdBy: '5e8731ab46a9919e14a10c87',
};

export const sprint3 = {
  id: '5eb023c3c479617b64d457a7',
  name: 'Sprint 3',
  ordinal: 3,
  createdAt: '2020-05-04T14:16:35.739Z',
  updatedAt: '2020-05-04T14:16:35.739Z',
  createdBy: '5e8731ab46a9919e14a10c87',
};

export const boardColumnTodo = {
  name: 'Todo',
  issueStatuses: ['BACKLOG', 'SELECTED_FOR_DEVELOPMENT'],
  ordinal: 0,
};

export const boardColumnInProgress = {
  name: 'In Progress',
  issueStatuses: ['IN_PROGRESS'],
  ordinal: 1,
};

export const boardColumnDone = {
  name: 'Done',
  issueStatuses: ['DONE'],
  ordinal: 2,
};

export const board1 = {
  id: '5e9f6c7a1510ec4fb4d69d45',
  type: 'SCRUM',
  name: 'Board 1',
  description: '',
  isBacklogVisible: true,
  isBoardVisible: true,
  columns: [boardColumnTodo, boardColumnInProgress, boardColumnDone],
  sprints: [sprint1],
  createdAt: '2020-04-21T21:58:18.46Z',
  updatedAt: '2020-05-04T14:16:35.739Z',
};

export const board2 = {
  id: '5e9f6c7a1510ec4fb4d69d45',
  type: 'KANBAN',
  name: 'Board 2',
  description: '',
  isBacklogVisible: false,
  isBoardVisible: true,
  columns: [boardColumnTodo, boardColumnInProgress, boardColumnDone],
  sprints: [],
  createdAt: '2020-04-21T21:58:18.46Z',
  updatedAt: '2020-05-04T14:16:35.739Z',
};

export const project1 = {
  id: '5e9f6c7a1510ec4fb4d69d46',
  key: 'AA',
  name: 'Project 1',
  type: 'SOFTWARE',
  description: 'Project 1 description',
  leadId: '5e8731ab46a9919e14a10c87',
  defaultAssigneeId: '5e8731ab46a9919e14a10c87',
  defaultBoardId: '5e9f6c7a1510ec4fb4d69d45',
  boards: [board1],
  createdAt: '2020-04-21T21:58:18.462Z',
  updatedAt: '2020-04-21T21:58:18.462Z',
};

export const project2 = {
  id: '5ea16f68b172b550ebfa2337',
  key: 'BB',
  name: 'Project 2',
  type: 'SOFTWARE',
  description: 'Project 2 description',
  leadId: '5e8731ab46a9919e14a10c87',
  defaultAssigneeId: '5e8731ab46a9919e14a10c87',
  defaultBoardId: '5e9f6c7a1510ec4fb4d69d45',
  boards: [board1],
  createdAt: '2020-04-21T21:58:18.462Z',
  updatedAt: '2020-04-21T21:58:18.462Z',
};

export const project3 = {
  id: '5ea1ca98b172b550ebfa233b',
  key: 'CC',
  name: 'Project 3',
  type: 'SOFTWARE',
  description: 'Project 3 description',
  leadId: '5e8731ab46a9919e14a10c87',
  defaultAssigneeId: '5e8731ab46a9919e14a10c87',
  defaultBoardId: '5e9f6c7a1510ec4fb4d69d45',
  boards: [board1],
  createdAt: '2020-04-21T21:58:18.462Z',
  updatedAt: '2020-04-21T21:58:18.462Z',
};

export const boardTypes = [
  {
    id: 'KANBAN',
    name: 'Kanban Board',
    default: true,
  },
  {
    id: 'SCRUM',
    name: 'Scrum',
    default: false,
  },
];

export const projectTypes = [
  {
    id: 'SOFTWARE',
    name: 'Software',
    default: true,
  },
];

export const projectsMetadata = {
  pagination: {
    pageSize: 100,
    cursor: '5ebeb215378f434265fdd9ef',
  },
  count: 6,
};
