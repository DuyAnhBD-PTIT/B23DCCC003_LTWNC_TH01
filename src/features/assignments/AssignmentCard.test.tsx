import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AssignmentCard } from './AssignmentCard';
import type { Assignment } from './types';

const item: Assignment = {
  id: 'a',
  subject: 'Lập trình Web',
  title: 'Bài tập React',
  dueDate: '2026-10-20',
  priority: 'high',
  completed: false,
  createdAt: '2026-01-01T00:00:00.000Z',
};
const props = () => ({
  item,
  now: new Date('2026-10-13'),
  pinned: false,
  onToggle: jest.fn(),
  onDelete: jest.fn(),
  onPin: jest.fn(),
});

describe('AssignmentCard', () => {
  it('shows title, subject, and deadline', () => {
    render(<AssignmentCard {...props()} />);
    expect(screen.getByText('Bài tập React')).toBeInTheDocument();
    expect(screen.getByText('Lập trình Web')).toBeInTheDocument();
    expect(screen.getByText('Còn 7 ngày')).toBeInTheDocument();
  });
  it('calls completion handler', async () => {
    const user = userEvent.setup();
    const cardProps = props();
    render(<AssignmentCard {...cardProps} />);
    await user.click(screen.getByRole('button', { name: /đánh dấu hoàn thành/i }));
    expect(cardProps.onToggle).toHaveBeenCalledWith('a');
  });
  it('calls pin handler and exposes pressed state', async () => {
    const user = userEvent.setup();
    const cardProps = props();
    render(<AssignmentCard {...cardProps} />);
    const button = screen.getByRole('button', { name: /ghim bài tập/i });
    await user.click(button);
    expect(cardProps.onPin).toHaveBeenCalledWith('a');
    expect(button).toHaveAttribute('aria-pressed', 'false');
  });
});
