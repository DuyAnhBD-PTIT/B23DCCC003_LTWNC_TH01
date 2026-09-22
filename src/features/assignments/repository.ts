import { createStorage } from '../../lib/storage';
import { isAssignment, toDateInput, type Assignment } from './types';

export const assignmentStorage = createStorage<Assignment[]>(
  'student-deadline-tracker:v1',
  (value): value is Assignment[] =>
    Array.isArray(value) &&
    value.every(isAssignment) &&
    new Set(value.map((item) => item.id)).size === value.length,
);

export function sampleAssignments(): Assignment[] {
  const date = (offset: number) => {
    const now = new Date();
    now.setDate(now.getDate() + offset);
    return toDateInput(now);
  };
  return [
    {
      id: 'sample-1',
      subject: 'Lập trình Web nâng cao',
      title: 'Xây dựng Student Deadline Tracker',
      dueDate: date(3),
      priority: 'high',
      completed: false,
    },
    {
      id: 'sample-2',
      subject: 'Cơ sở dữ liệu',
      title: 'Thiết kế sơ đồ ERD cho thư viện',
      dueDate: date(0),
      priority: 'high',
      completed: false,
    },
    {
      id: 'sample-3',
      subject: 'Cấu trúc dữ liệu & Giải thuật',
      title: 'Cài đặt các thuật toán sắp xếp',
      dueDate: date(-2),
      priority: 'medium',
      completed: false,
    },
    {
      id: 'sample-4',
      subject: 'Tiếng Anh',
      title: 'Chuẩn bị bài thuyết trình nhóm',
      dueDate: date(5),
      priority: 'low',
      completed: false,
    },
    {
      id: 'sample-5',
      subject: 'Lập trình Web nâng cao',
      title: 'Thực hành TypeScript nâng cao',
      dueDate: date(-1),
      priority: 'medium',
      completed: true,
    },
  ].map((item) => ({
    ...item,
    priority: item.priority as Assignment['priority'],
    createdAt: new Date().toISOString(),
  }));
}
