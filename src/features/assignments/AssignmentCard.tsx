import { memo } from 'react';
import { Check, CheckCheck, Circle, Clock3, Pin, Trash2 } from 'lucide-react';
import { deadlineLabel, daysUntil, type Assignment } from './types';

interface AssignmentCardProps {
  item: Assignment;
  now: Date;
  pinned: boolean;
  onToggle: (id: string) => void;
  onDelete: (item: Assignment) => void;
  onPin: (id: string) => void;
}

export const AssignmentCard = memo(function AssignmentCard({
  item,
  now,
  pinned,
  onToggle,
  onDelete,
  onPin,
}: AssignmentCardProps) {
  const days = daysUntil(item.dueDate, now);
  return (
    <article className={`assignment-card ${item.completed ? 'completed-row' : ''}`}>
      <button
        className={`check-button ${item.completed ? 'checked' : ''}`}
        aria-label={`${item.completed ? 'Bỏ đánh dấu hoàn thành' : 'Đánh dấu hoàn thành'}: ${item.title}`}
        aria-pressed={item.completed}
        onClick={() => onToggle(item.id)}
      >
        {item.completed && <Check size={14} />}
      </button>
      <div className="assignment-name">
        <strong>{item.title}</strong>
        <span>
          <span className="subject-dot" />
          {item.subject}
        </span>
      </div>
      <div className="date-cell">
        <span>{new Date(`${item.dueDate}T00:00:00`).toLocaleDateString('vi-VN')}</span>
        <small className={!item.completed && days < 0 ? 'overdue-text' : ''}>
          {deadlineLabel(days)}
        </small>
      </div>
      <span className={`priority ${item.priority}`}>
        <i />
        {item.priority === 'high' ? 'Cao' : item.priority === 'medium' ? 'Trung bình' : 'Thấp'}
      </span>
      <span className={`status ${item.completed ? 'done' : days < 0 ? 'late' : 'pending'}`}>
        {item.completed ? <CheckCheck size={13} /> : days < 0 ? <Clock3 size={13} /> : <Circle size={10} />}
        {item.completed ? 'Hoàn thành' : days < 0 ? 'Quá hạn' : 'Chưa hoàn thành'}
      </span>
      <div className="card-actions">
        <button
          className={`icon-button pin-button ${pinned ? 'pinned' : ''}`}
          aria-label={`${pinned ? 'Bỏ ghim' : 'Ghim'} bài tập: ${item.title}`}
          aria-pressed={pinned}
          onClick={() => onPin(item.id)}
        >
          <Pin size={16} />
        </button>
        <button className="icon-button delete-button" aria-label={`Xoá bài tập: ${item.title}`} onClick={() => onDelete(item)}>
          <Trash2 size={16} />
        </button>
      </div>
    </article>
  );
});
