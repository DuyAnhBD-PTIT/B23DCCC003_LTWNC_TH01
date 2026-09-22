import { createContext, useContext, type ReactNode } from 'react';
import type { StatusFilter } from '../features/assignments/types';

const TabsContext = createContext<{
  value: StatusFilter;
  onChange: (value: StatusFilter) => void;
} | null>(null);

function Root({
  value,
  onChange,
  children,
}: {
  value: StatusFilter;
  onChange: (value: StatusFilter) => void;
  children: ReactNode;
}) {
  return (
    <TabsContext.Provider value={{ value, onChange }}>
      <div className="tabs" role="group" aria-label="Lọc trạng thái bài tập">
        {children}
      </div>
    </TabsContext.Provider>
  );
}
function Item({ value, children }: { value: StatusFilter; children: ReactNode }) {
  const context = useContext(TabsContext);
  if (!context) throw new Error('Tabs.Item phải nằm trong Tabs.Root');
  return (
    <button
      className={context.value === value ? 'tab active' : 'tab'}
      aria-pressed={context.value === value}
      onClick={() => context.onChange(value)}
    >
      {children}
    </button>
  );
}
export const Tabs = { Root, Item };
