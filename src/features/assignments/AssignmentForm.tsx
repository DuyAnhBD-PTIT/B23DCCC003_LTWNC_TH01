import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Plus, X } from 'lucide-react';
import { useAppDispatch } from '../../app/hooks';
import { addAssignment } from './assignmentsSlice';
import { isValidDate, type AssignmentErrors, type NewAssignment, type Priority } from './types';

export function AssignmentForm({ onClose }: { onClose: () => void }) {
  const dispatch = useAppDispatch();
  const dialog = useRef<HTMLDialogElement>(null);
  const subjectInput = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState<NewAssignment>({
    subject: '',
    title: '',
    dueDate: '',
    priority: 'medium',
  });
  const [errors, setErrors] = useState<AssignmentErrors>({});
  useEffect(() => {
    const element = dialog.current;
    const previous = document.activeElement as HTMLElement | null;
    element?.showModal();
    subjectInput.current?.focus();
    return () => {
      element?.close();
      previous?.focus();
    };
  }, []);
  function update<K extends keyof NewAssignment>(key: K, value: NewAssignment[K]) {
    setForm((previous) => ({ ...previous, [key]: value }));
    setErrors((previous) => ({ ...previous, [key]: undefined }));
  }
  function submit(event: FormEvent) {
    event.preventDefault();
    const next: AssignmentErrors = {};
    if (!form.subject.trim()) next.subject = 'Vui lòng nhập môn học.';
    if (!form.title.trim()) next.title = 'Vui lòng nhập tên bài tập.';
    if (!isValidDate(form.dueDate)) next.dueDate = 'Vui lòng chọn hạn nộp hợp lệ.';
    setErrors(next);
    if (Object.keys(next).length) {
      const firstInvalidField = (['subject', 'title', 'dueDate'] as const).find((key) => next[key]);
      if (firstInvalidField) document.getElementById(firstInvalidField)?.focus();
      return;
    }
    dispatch(addAssignment(form));
    onClose();
  }
  return (
    <dialog ref={dialog} className="form-dialog" onCancel={onClose} aria-labelledby="form-title">
      <div className="dialog-heading">
        <div>
          <span className="eyebrow">LÊN KẾ HOẠCH HỌC TẬP</span>
          <h2 id="form-title">Thêm bài tập mới</h2>
        </div>
        <button className="icon-button" aria-label="Đóng" onClick={onClose}>
          <X size={20} />
        </button>
      </div>
      <p className="muted">Ghi lại hôm nay, an tâm hơn ngày mai.</p>
      <form onSubmit={submit} noValidate>
        <label htmlFor="subject">
          Môn học <span>*</span>
        </label>
        <input
          ref={subjectInput}
          id="subject"
          maxLength={100}
          placeholder="VD: Lập trình Web nâng cao"
          value={form.subject}
          onChange={(event) => update('subject', event.target.value)}
          aria-invalid={!!errors.subject}
          aria-describedby={errors.subject ? 'subject-error' : undefined}
        />
        {errors.subject && (
          <small id="subject-error" className="field-error">
            {errors.subject}
          </small>
        )}
        <label htmlFor="title">
          Tên bài tập <span>*</span>
        </label>
        <input
          id="title"
          maxLength={200}
          placeholder="Bạn cần hoàn thành việc gì?"
          value={form.title}
          onChange={(event) => update('title', event.target.value)}
          aria-invalid={!!errors.title}
          aria-describedby={errors.title ? 'title-error' : undefined}
        />
        {errors.title && (
          <small id="title-error" className="field-error">
            {errors.title}
          </small>
        )}
        <div className="form-row">
          <div>
            <label htmlFor="dueDate">
              Hạn nộp <span>*</span>
            </label>
            <input
              id="dueDate"
              type="date"
              value={form.dueDate}
              onChange={(event) => update('dueDate', event.target.value)}
              aria-invalid={!!errors.dueDate}
              aria-describedby={errors.dueDate ? 'date-error' : undefined}
            />
            {errors.dueDate && (
              <small id="date-error" className="field-error">
                {errors.dueDate}
              </small>
            )}
          </div>
          <div>
            <label htmlFor="priority">Độ ưu tiên</label>
            <select
              id="priority"
              value={form.priority}
              onChange={(event) => update('priority', event.target.value as Priority)}
            >
              <option value="high">Cao</option>
              <option value="medium">Trung bình</option>
              <option value="low">Thấp</option>
            </select>
          </div>
        </div>
        <div className="form-actions">
          <button type="button" className="secondary-button" onClick={onClose}>
            Huỷ
          </button>
          <button type="submit" className="primary-button">
            <Plus size={18} /> Thêm bài tập
          </button>
        </div>
      </form>
    </dialog>
  );
}
