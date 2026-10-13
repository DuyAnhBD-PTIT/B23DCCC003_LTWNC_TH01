import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AssignmentForm } from './AssignmentForm';

const dispatch = jest.fn();
jest.mock('../../app/hooks', () => ({ useAppDispatch: () => dispatch }));

beforeAll(() => {
  HTMLDialogElement.prototype.showModal = function () {
    this.setAttribute('open', '');
  };
  HTMLDialogElement.prototype.close = function () {
    this.removeAttribute('open');
  };
});

describe('AssignmentForm', () => {
  it('validates required fields', async () => {
    const user = userEvent.setup();
    render(<AssignmentForm onClose={jest.fn()} />);
    await user.click(screen.getByRole('button', { name: /thêm bài tập/i }));
    expect(screen.getByText('Vui lòng nhập môn học.')).toBeInTheDocument();
    expect(screen.getByText('Vui lòng nhập tên bài tập.')).toBeInTheDocument();
    expect(dispatch).not.toHaveBeenCalled();
  });
  it('submits a valid assignment', async () => {
    const user = userEvent.setup();
    render(<AssignmentForm onClose={jest.fn()} />);
    await user.type(screen.getByLabelText(/môn học/i), 'Web');
    await user.type(screen.getByLabelText(/tên bài tập/i), 'Ôn tập');
    await user.type(screen.getByLabelText(/hạn nộp/i), '2026-10-20');
    await user.click(screen.getByRole('button', { name: /thêm bài tập/i }));
    expect(dispatch).toHaveBeenCalledTimes(1);
  });
});
