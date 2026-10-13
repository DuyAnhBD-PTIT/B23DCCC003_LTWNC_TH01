import { useCallback, useMemo, type CSSProperties } from 'react';
import { List } from 'react-window';
import { useAppDispatch } from '../../app/hooks';
import { deleteAssignment, toggleAssignment } from './assignmentsSlice';
import { AssignmentCard } from './AssignmentCard';
import { usePinStore } from './pinStore';
import type { Assignment } from './types';

export function AssignmentList({ items, now }: { items: Assignment[]; now: Date }) {
  const dispatch = useAppDispatch();
  const togglePin = usePinStore((state) => state.togglePin);
  const pinnedIds = usePinStore((state) => state.pinnedIds);
  const isPinned = useCallback((id: string) => pinnedIds.includes(id), [pinnedIds]);
  const sortedItems = useMemo(
    () => [...items].sort((a, b) => Number(isPinned(b.id)) - Number(isPinned(a.id))),
    [items, isPinned],
  );
  const onToggle = useCallback((id: string) => dispatch(toggleAssignment(id)), [dispatch]);
  const onPin = useCallback((id: string) => togglePin(id), [togglePin]);
  const onDelete = useCallback(
    (item: Assignment) => {
      if (window.confirm(`Xoá bài tập “${item.title}”?`)) dispatch(deleteAssignment(item.id));
    },
    [dispatch],
  );
  const Row = useCallback(
    ({ index, style }: { index: number; style: CSSProperties }) => {
      const item = sortedItems[index];
      return (
        <div style={style} className="virtual-row">
          <AssignmentCard
            item={item}
            now={now}
            pinned={isPinned(item.id)}
            onToggle={onToggle}
            onDelete={onDelete}
            onPin={onPin}
          />
        </div>
      );
    },
    [isPinned, now, onDelete, onPin, onToggle, sortedItems],
  );
  return (
    <div className="virtual-list" data-testid="assignment-list">
      <List<Record<string, never>>
        rowComponent={Row}
        rowProps={{}}
        rowCount={sortedItems.length}
        rowHeight={92}
        defaultHeight={560}
        overscanCount={8}
      />
    </div>
  );
}
