import { configureStore } from '@reduxjs/toolkit';
import reducer, { loadAssignments } from './assignmentsSlice';
import { assignmentStorage } from './repository';

describe('assignment loading', () => {
  it('loads saved assignments successfully', async () => {
    const store = configureStore({ reducer: { assignments: reducer } });
    await store.dispatch(loadAssignments());
    expect(store.getState().assignments.status).toBe('succeeded');
    expect(store.getState().assignments.items.length).toBeGreaterThan(0);
  });
  it('reports storage errors', async () => {
    const original = assignmentStorage.read;
    assignmentStorage.read = () => {
      throw new Error('storage unavailable');
    };
    const store = configureStore({ reducer: { assignments: reducer } });
    await store.dispatch(loadAssignments());
    expect(store.getState().assignments.status).toBe('failed');
    expect(store.getState().assignments.error).toContain('storage unavailable');
    assignmentStorage.read = original;
  });
});
