export type Priority = 'high' | 'medium' | 'low';
export type StatusFilter = 'all' | 'pending' | 'overdue' | 'completed';

export interface Assignment {
  id: string;
  subject: string;
  title: string;
  dueDate: string;
  priority: Priority;
  completed: boolean;
  createdAt: string;
}

export type NewAssignment = Omit<Assignment, 'id' | 'completed' | 'createdAt'>;
export type AssignmentErrors = Partial<Record<keyof NewAssignment, string>>;

export function isValidDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00`);
  return !Number.isNaN(date.getTime()) && toDateInput(date) === value;
}

export function toDateInput(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

export function isAssignment(value: unknown): value is Assignment {
  if (typeof value !== 'object' || value === null) return false;
  const item = value as Record<string, unknown>;
  return (
    typeof item.id === 'string' &&
    item.id.length > 0 &&
    typeof item.subject === 'string' &&
    item.subject.trim().length > 0 &&
    typeof item.title === 'string' &&
    item.title.trim().length > 0 &&
    typeof item.dueDate === 'string' &&
    isValidDate(item.dueDate) &&
    ['high', 'medium', 'low'].includes(String(item.priority)) &&
    typeof item.completed === 'boolean' &&
    typeof item.createdAt === 'string' &&
    !Number.isNaN(Date.parse(item.createdAt))
  );
}

export function daysUntil(dueDate: string, today = new Date()): number {
  const [year, month, day] = dueDate.split('-').map(Number);
  return Math.round(
    (Date.UTC(year, month - 1, day) -
      Date.UTC(today.getFullYear(), today.getMonth(), today.getDate())) /
      86_400_000,
  );
}

export function deadlineLabel(days: number): string {
  return days < 0
    ? `Quá hạn ${Math.abs(days)} ngày`
    : days === 0
      ? 'Còn 0 ngày · Hôm nay'
      : `Còn ${days} ngày`;
}
