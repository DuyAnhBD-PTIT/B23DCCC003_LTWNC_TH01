import { useState } from 'react';
import {
  BookOpen,
  CalendarDays,
  Check,
  CheckCheck,
  Circle,
  Clock3,
  GraduationCap,
  ListTodo,
  Plus,
  Search,
  Sparkles,
  Trash2,
} from 'lucide-react';
import { useAppDispatch } from './app/hooks';
import { Tabs } from './components/Tabs';
import { AssignmentForm } from './features/assignments/AssignmentForm';
import {
  deleteAssignment,
  loadAssignments,
  toggleAssignment,
} from './features/assignments/assignmentsSlice';
import { deadlineLabel, daysUntil, type StatusFilter } from './features/assignments/types';
import { useAssignments } from './features/assignments/useAssignments';

const filters: { value: StatusFilter; label: string }[] = [
  { value: 'all', label: 'Tất cả' },
  { value: 'pending', label: 'Chưa hoàn thành' },
  { value: 'overdue', label: 'Quá hạn' },
  { value: 'completed', label: 'Đã hoàn thành' },
];
const priorities = { high: 'Cao', medium: 'Trung bình', low: 'Thấp' };

export default function App() {
  const { items, counts, filter, setFilter, query, setQuery, now, status, error, storageError } =
    useAssignments();
  const dispatch = useAppDispatch();
  const [showForm, setShowForm] = useState(false);
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
            <div>
              <div className="eyebrow">HỌC TẬP CÓ KẾ HOẠCH</div>
              <h1>
                Deadline của bạn<span>.</span>
              </h1>
              <p>Theo dõi bài tập, chủ động thời gian, bớt một nỗi lo.</p>
            </div>
            <button
              className="primary-button"
              disabled={status !== 'succeeded'}
              onClick={() => setShowForm(true)}
            >
              <Plus size={19} /> Thêm bài tập
            </button>
          </div>
          <section className="stats" aria-label="Thống kê bài tập">
            {[
              {
                title: 'Tổng bài tập',
                count: counts.all,
                icon: <BookOpen size={21} />,
                color: 'sage',
                detail: 'Tất cả môn học',
              },
              {
                title: 'Chưa hoàn thành',
                count: counts.pending,
                icon: <Clock3 size={21} />,
                color: 'amber',
                detail: 'Đang chờ bạn chinh phục',
              },
              {
                title: 'Đã quá hạn',
                count: counts.overdue,
                icon: <CalendarDays size={21} />,
                color: 'red',
                detail: 'Ưu tiên xử lý sớm nhé',
              },
              {
                title: 'Đã hoàn thành',
                count: counts.completed,
                icon: <CheckCheck size={21} />,
                color: 'green',
                detail: 'Thêm một bước tiến bộ',
              },
            ].map((stat) => (
              <article className="stat-card" key={stat.title}>
                <div className="stat-top">
                  <span>{stat.title}</span>
                  <span className={`stat-icon ${stat.color}`}>{stat.icon}</span>
                </div>
                <strong>{stat.count.toString().padStart(2, '0')}</strong>
                <small>{stat.detail}</small>
              </article>
            ))}
          </section>
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
                <p>Mọi deadline, trong một góc nhỏ gọn gàng.</p>
              </div>
              <span className="sort-label">
                <ListTodo size={16} /> Hạn nộp gần nhất
              </span>
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
              <div className="table-scroll">
                <table>
                  <thead>
                    <tr>
                      <th className="check-cell">
                        <span className="sr-only">Hoàn thành</span>
                      </th>
                      <th>BÀI TẬP / MÔN HỌC</th>
                      <th>HẠN NỘP</th>
                      <th>ƯU TIÊN</th>
                      <th>TRẠNG THÁI</th>
                      <th>
                        <span className="sr-only">Thao tác</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item) => {
                      const days = daysUntil(item.dueDate, now);
                      return (
                        <tr key={item.id} className={item.completed ? 'completed-row' : ''}>
                          <td className="check-cell">
                            <button
                              className={`check-button ${item.completed ? 'checked' : ''}`}
                              aria-label={`${item.completed ? 'Bỏ đánh dấu hoàn thành' : 'Đánh dấu hoàn thành'}: ${item.title}`}
                              aria-pressed={item.completed}
                              onClick={() => dispatch(toggleAssignment(item.id))}
                            >
                              {item.completed && <Check size={14} />}
                            </button>
                          </td>
                          <td className="assignment-name">
                            <strong>{item.title}</strong>
                            <span>
                              <span className="subject-dot" />
                              {item.subject}
                            </span>
                          </td>
                          <td className="date-cell">
                            <span>
                              {new Date(`${item.dueDate}T00:00:00`).toLocaleDateString('vi-VN')}
                            </span>
                            <small
                              className={
                                !item.completed && days < 0
                                  ? 'overdue-text'
                                  : !item.completed && days === 0
                                    ? 'due-today'
                                    : ''
                              }
                            >
                              {deadlineLabel(days)}
                            </small>
                          </td>
                          <td>
                            <span className={`priority ${item.priority}`}>
                              <i />
                              {priorities[item.priority]}
                            </span>
                          </td>
                          <td>
                            <span
                              className={`status ${item.completed ? 'done' : days < 0 ? 'late' : 'pending'}`}
                            >
                              {item.completed ? (
                                <CheckCheck size={13} />
                              ) : days < 0 ? (
                                <Clock3 size={13} />
                              ) : (
                                <Circle size={10} />
                              )}
                              {item.completed
                                ? 'Hoàn thành'
                                : days < 0
                                  ? 'Quá hạn'
                                  : 'Chưa hoàn thành'}
                            </span>
                          </td>
                          <td>
                            <button
                              className="icon-button delete-button"
                              aria-label={`Xoá bài tập: ${item.title}`}
                              onClick={() => {
                                if (window.confirm(`Xoá bài tập “${item.title}”?`))
                                  dispatch(deleteAssignment(item.id));
                              }}
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
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
