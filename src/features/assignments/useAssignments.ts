import { useEffect, useMemo, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { loadAssignments } from './assignmentsSlice';
import { daysUntil, type StatusFilter } from './types';

export function useAssignments() {
  const dispatch = useAppDispatch();
  const state = useAppSelector((state) => state.assignments);
  const [filter, setFilter] = useState<StatusFilter>('all');
  const [query, setQuery] = useState('');
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    void dispatch(loadAssignments());
  }, [dispatch]);
  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 30_000);
    const refresh = () => setNow(new Date());
    window.addEventListener('focus', refresh);
    return () => {
      window.clearInterval(timer);
      window.removeEventListener('focus', refresh);
    };
  }, []);
  const counts = useMemo(
    () => ({
      all: state.items.length,
      pending: state.items.filter((item) => !item.completed).length,
      overdue: state.items.filter((item) => !item.completed && daysUntil(item.dueDate, now) < 0)
        .length,
      completed: state.items.filter((item) => item.completed).length,
    }),
    [state.items, now],
  );
  const items = useMemo(
    () =>
      state.items
        .filter((item) => {
          const matchesStatus =
            filter === 'all' ||
            (filter === 'completed'
              ? item.completed
              : !item.completed && (filter !== 'overdue' || daysUntil(item.dueDate, now) < 0));
          return (
            matchesStatus &&
            `${item.subject} ${item.title}`
              .toLocaleLowerCase('vi')
              .includes(query.trim().toLocaleLowerCase('vi'))
          );
        })
        .sort(
          (a, b) => Number(a.completed) - Number(b.completed) || a.dueDate.localeCompare(b.dueDate),
        ),
    [state.items, filter, query, now],
  );
  return { ...state, items, counts, filter, setFilter, query, setQuery, now };
}
