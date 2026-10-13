import type { Assignment } from './types';

export function isOverdue(assignment: Assignment, today = new Date()): boolean {
  return !assignment.completed && calcDaysLeft(assignment.dueDate, today) < 0;
}

export function calcDaysLeft(dueDate: string, today = new Date()): number {
  const [year, month, day] = dueDate.split('-').map(Number);
  return Math.round(
    (Date.UTC(year, month - 1, day) -
      Date.UTC(today.getFullYear(), today.getMonth(), today.getDate())) /
      86_400_000,
  );
}

export function calcStats(items: Assignment[], today = new Date()) {
  const bySubject = items.reduce<Record<string, number>>((result, item) => {
    result[item.subject] = (result[item.subject] ?? 0) + 1;
    return result;
  }, {});
  return {
    total: items.length,
    completed: items.filter((item) => item.completed).length,
    overdue: items.filter((item) => isOverdue(item, today)).length,
    bySubject,
  };
}
