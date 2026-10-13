import {
  BookOpen,
  CalendarDays,
  GraduationCap,
  Moon,
  Plus,
  Search,
  Sparkles,
  Sun,
} from 'lucide-react';
import { useCallback, useState } from 'react';
import { lazy, Suspense } from 'react';
import { useAppDispatch } from './app/hooks';
import { Tabs } from './components/Tabs';
import { useTheme } from './contexts/ThemeContext';
import { AssignmentForm } from './features/assignments/AssignmentForm';
import { AssignmentList } from './features/assignments/AssignmentList';
import { addAssignments, loadAssignments } from './features/assignments/assignmentsSlice';
import { generateSampleAssignments } from './features/assignments/repository';
import { type StatusFilter } from './features/assignments/types';
import { useAssignments } from './features/assignments/useAssignments';

const Statistics = lazy(() => import('./features/assignments/Statistics'));

const filters: { value: StatusFilter; label: string }[] = [
  { value: 'all', label: 'Tất cả' },
  { value: 'pending', label: 'Chưa hoàn thành' },
  { value: 'overdue', label: 'Quá hạn' },
  { value: 'completed', label: 'Đã hoàn thành' },
];
export default function App() {
  const { items, counts, filter, setFilter, query, setQuery, now, status, error, storageError } =
    useAssignments();
  const dispatch = useAppDispatch();
  const { theme, toggleTheme } = useTheme();
  const [showForm, setShowForm] = useState(false);
  const [showStatistics, setShowStatistics] = useState(false);
  const createStressData = useCallback(() => {
    dispatch(addAssignments(generateSampleAssignments(10_000)));
  }, [dispatch]);
  const progress = counts.all ? Math.round((counts.completed / counts.all) * 100) : 0;
  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="header-inner">
          <a className="brand" href="#top" aria-label="Deadline Student Planner — về đầu trang">
            <span className="brand-icon" aria-hidden="true">
              <GraduationCap size={24} />
            </span>
            <span className="brand-name">
              Deadline<span className="brand-dot">.</span>
              <small>STUDENT PLANNER</small>
            </span>
          </a>
          <nav aria-label="Điều hướng chính">
            <a className="nav-item selected" href="#assignments" aria-current="page">
              Tổng quan
            </a>
          </nav>
          <div className="header-meta">
            <button className="icon-button" aria-label="Đổi chủ đề sáng tối" onClick={toggleTheme}>
              {theme === 'light' ? <Moon size={17} /> : <Sun size={17} />}
            </button>
            <span className="today">
              <CalendarDays size={17} aria-hidden="true" />
              <span className="date-full">
                {now.toLocaleDateString('vi-VN', {
                  weekday: 'short',
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                })}
              </span>
              <span className="date-short">
                {now.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })}
              </span>
            </span>
            <span className="avatar" aria-label="Hồ sơ sinh viên">
              SV
            </span>
          </div>
        </div>
      </header>
      <div className="main-shell" id="top">
        <main>
          <div className="page-heading">
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                gap: '0.25rem',
                flexWrap: 'wrap',
                justifyContent: 'flex-end',
              }}
            >
              <button
                className="primary-button"
                disabled={status !== 'succeeded'}
                onClick={() => setShowForm(true)}
              >
                <Plus size={19} /> Thêm bài tập
              </button>
              <button className="secondary-button" onClick={createStressData}>
                Tạo 10.000 bài tập mẫu
              </button>
              <button
                className="secondary-button"
                onClick={() => setShowStatistics((value) => !value)}
              >
                {showStatistics ? 'Ẩn thống kê' : 'Xem thống kê'}
              </button>
            </div>
          </div>

          {showStatistics && (
            <Suspense fallback={<div role="status">Đang tải thống kê…</div>}>
              <Statistics items={items} />
            </Suspense>
          )}

          <section className="progress-banner">
            <div className="progress-symbol">
              <Sparkles size={23} />
            </div>
            <div className="progress-copy">
              <strong>
                {progress === 100
                  ? 'Tuyệt vời, bạn đã hoàn thành tất cả!'
                  : 'Mỗi bài tập hoàn thành là một bước tiến.'}
              </strong>
              <span>
                Bạn đã hoàn thành {counts.completed}/{counts.all} bài tập.{' '}
                {counts.all ? 'Tiếp tục phát huy nhé!' : 'Thêm bài tập đầu tiên để bắt đầu nhé!'}
              </span>
            </div>
            <div className="progress-info">
              <div>
                <span>Tiến độ của bạn</span>
                <strong>{progress}%</strong>
              </div>
              <progress max="100" value={progress} aria-label="Tiến độ hoàn thành" />
            </div>
          </section>
          <section className="assignments-section" id="assignments">
            <div className="section-heading">
              <div>
                <h2>
                  Danh sách bài tập <span>{counts.all}</span>
                </h2>
              </div>
            </div>
            {storageError && (
              <div role="alert" className="error-banner">
                {storageError}
              </div>
            )}
            <div className="toolbar">
              <Tabs.Root value={filter} onChange={setFilter}>
                {filters.map((item) => (
                  <Tabs.Item key={item.value} value={item.value}>
                    {item.label}
                    <span>{counts[item.value]}</span>
                  </Tabs.Item>
                ))}
              </Tabs.Root>
              <div className="search">
                <Search size={17} />
                <input
                  aria-label="Tìm môn học hoặc bài tập"
                  placeholder="Tìm môn học, bài tập..."
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                />
              </div>
            </div>
            {status === 'failed' ? (
              <div role="alert" className="empty-state">
                <h3>Chưa thể tải dữ liệu</h3>
                <p>{error}</p>
                <button
                  className="secondary-button"
                  onClick={() => void dispatch(loadAssignments())}
                >
                  Thử lại
                </button>
              </div>
            ) : status !== 'succeeded' ? (
              <div className="empty-state" role="status">
                Đang tải bài tập…
              </div>
            ) : items.length === 0 ? (
              <div className="empty-state">
                <BookOpen size={36} />
                <h3>
                  {counts.all ? 'Không tìm thấy bài tập phù hợp' : 'Một khởi đầu thật gọn gàng'}
                </h3>
                <p>
                  {counts.all
                    ? 'Thử đổi bộ lọc hoặc từ khoá tìm kiếm.'
                    : 'Thêm bài tập đầu tiên để theo dõi deadline của bạn.'}
                </p>
              </div>
            ) : (
              <AssignmentList items={items} now={now} />
            )}
            <div className="table-footer">
              <span aria-live="polite">Hiển thị {items.length} bài tập</span>
              <span>
                <span
                  className={`save-dot ${storageError || status === 'failed' ? 'unsaved' : ''}`}
                />
                {storageError
                  ? 'Chưa lưu được thay đổi'
                  : status === 'succeeded'
                    ? 'Đã lưu trên trình duyệt này'
                    : 'Lưu trữ trên trình duyệt'}
              </span>
            </div>
          </section>
          <footer className="page-footer">
            <GraduationCap size={16} /> Student Deadline Tracker{' '}
            <span>Một chút tổ chức. Nhiều hơn sự an tâm.</span>
          </footer>
        </main>
      </div>
      {showForm && <AssignmentForm onClose={() => setShowForm(false)} />}
    </div>
  );
}
