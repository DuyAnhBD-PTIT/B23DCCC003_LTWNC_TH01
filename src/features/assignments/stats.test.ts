import { calcDaysLeft, calcStats, isOverdue } from './stats';
import type { Assignment } from './types';

const item = (overrides: Partial<Assignment> = {}): Assignment => ({
  id: '1',
  subject: 'Web',
  title: 'Task',
  dueDate: '2026-10-13',
  priority: 'medium',
  completed: false,
  createdAt: '2026-01-01T00:00:00.000Z',
  ...overrides,
});

describe('assignment statistics', () => {
  it('calculates days including today and boundary dates', () => {
    expect(calcDaysLeft('2026-10-13', new Date('2026-10-13T12:00:00'))).toBe(0);
    expect(calcDaysLeft('2026-10-12', new Date('2026-10-13T12:00:00'))).toBe(-1);
  });
  it('only marks incomplete past assignments overdue', () => {
    expect(isOverdue(item(), new Date('2026-10-14T00:00:00'))).toBe(true);
    expect(isOverdue(item({ completed: true }), new Date('2026-10-14T00:00:00'))).toBe(false);
  });
  it('calculates totals, completed, overdue, and subjects', () => {
    expect(calcStats([item(), item({ id: '2', completed: true }), item({ id: '3', subject: 'DB' })], new Date('2026-10-14'))).toEqual({
      total: 3,
      completed: 1,
      overdue: 2,
      bySubject: { Web: 2, DB: 1 },
    });
  });
});
