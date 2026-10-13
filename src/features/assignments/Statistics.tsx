import { calcStats } from './stats';
import type { Assignment } from './types';

export default function Statistics({ items }: { items: Assignment[] }) {
  const stats = calcStats(items);
  return (
    <section className="statistics-panel" aria-label="Thống kê chi tiết">
      <h2>Thống kê</h2>
      <p>Đã xong: {stats.completed} · Quá hạn: {stats.overdue}</p>
      <ul>
        {Object.entries(stats.bySubject).map(([subject, count]) => (
          <li key={subject}>{subject}: {count}</li>
        ))}
      </ul>
    </section>
  );
}
