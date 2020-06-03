import { defaultPagination } from 'constants';

export const sprintDurationOptions = [
  { id: 1, name: '1 week' },
  { id: 2, name: '2 weeks' },
  { id: 3, name: '3 weeks' },
  { id: 4, name: '4 weeks' },
  { id: 0, name: 'Custom' },
];

export const defaultProjectMetadata = {
  pagination: {
    ...defaultPagination,
  },
  count: 0,
  filters: [],
};

export const BoardType = {
  KANBAN: 'KANBAN',
  SCRUM: 'SCRUM',
};
