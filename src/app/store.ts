import { configureStore, createListenerMiddleware, isAnyOf } from '@reduxjs/toolkit';
import logger from 'redux-logger';
import assignments, {
  addAssignment,
  deleteAssignment,
  toggleAssignment,
  addAssignments,
  setStorageError,
} from '../features/assignments/assignmentsSlice';
import { assignmentStorage } from '../features/assignments/repository';

const persistence = createListenerMiddleware();
export const store = configureStore({
  reducer: { assignments },
  middleware: (getDefault) =>
    getDefault()
      .prepend(persistence.middleware)
      .concat(...(import.meta.env.DEV ? [logger] : [])),
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

persistence.startListening({
  matcher: isAnyOf(addAssignment, addAssignments, toggleAssignment, deleteAssignment),
  effect: (_, api) => {
    try {
      assignmentStorage.write((api.getState() as RootState).assignments.items);
      api.dispatch(setStorageError(null));
    } catch {
      api.dispatch(
        setStorageError(
          'Không thể lưu thay đổi. Hãy kiểm tra quyền lưu trữ hoặc dung lượng trình duyệt trước khi đóng trang.',
        ),
      );
    }
  },
});
