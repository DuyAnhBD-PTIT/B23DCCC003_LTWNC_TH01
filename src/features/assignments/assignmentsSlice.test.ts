import reducer, { addAssignment, deleteAssignment, toggleAssignment } from './assignmentsSlice';
import type { Assignment } from './types';

const item: Assignment = {
  id: 'a',
  subject: 'Web',
  title: 'Task',
  dueDate: '2026-10-13',
  priority: 'high',
  completed: false,
  createdAt: '2026-01-01T00:00:00.000Z',
};

describe('assignments reducer', () => {
  it('adds trimmed assignment', () => {
    const state = reducer(undefined, addAssignment({ ...item, subject: ' Web ', title: ' Task ' }));
    expect(state.items[0]).toMatchObject({ subject: 'Web', title: 'Task', completed: false });
  });
  it('toggles and deletes existing assignments', () => {
    const state = { items: [item], status: 'succeeded' as const, error: null, storageError: null };
    expect(reducer(state, toggleAssignment('a')).items[0].completed).toBe(true);
    expect(reducer(state, deleteAssignment('a')).items).toHaveLength(0);
  });
  it('does nothing for an unknown id', () => {
    const state = { items: [item], status: 'succeeded' as const, error: null, storageError: null };
    expect(reducer(state, toggleAssignment('missing')).items).toEqual([item]);
  });
});
