import { createAsyncThunk, createSlice, nanoid, type PayloadAction } from '@reduxjs/toolkit';
import { assignmentStorage, sampleAssignments } from './repository';
import type { Assignment, NewAssignment } from './types';

interface AssignmentsState {
  items: Assignment[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  storageError: string | null;
}
const initialState: AssignmentsState = {
  items: [],
  status: 'idle',
  error: null,
  storageError: null,
};

export const loadAssignments = createAsyncThunk<
  Assignment[],
  void,
  { rejectValue: string; state: { assignments: AssignmentsState } }
>(
  'assignments/load',
  async (_, { rejectWithValue }) => {
    try {
      const saved = assignmentStorage.read();
      if (saved !== null) return saved;
      const samples = sampleAssignments();
      assignmentStorage.write(samples);
      return samples;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Không thể đọc localStorage.',
      );
    }
  },
  {
    condition: (_, { getState }) =>
      !['loading', 'succeeded'].includes(getState().assignments.status),
  },
);

const assignmentsSlice = createSlice({
  name: 'assignments',
  initialState,
  reducers: {
    addAssignment: {
      reducer(state, action: PayloadAction<Assignment>) {
        state.items.push(action.payload);
      },
      prepare(input: NewAssignment) {
        return {
          payload: {
            ...input,
            subject: input.subject.trim(),
            title: input.title.trim(),
            id: nanoid(),
            completed: false,
            createdAt: new Date().toISOString(),
          },
        };
      },
    },
    toggleAssignment(state, action: PayloadAction<string>) {
      const item = state.items.find((item) => item.id === action.payload);
      if (item) item.completed = !item.completed;
    },
    deleteAssignment(state, action: PayloadAction<string>) {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    setStorageError(state, action: PayloadAction<string | null>) {
      state.storageError = action.payload;
    },
  },
  extraReducers: (builder) =>
    builder
      .addCase(loadAssignments.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loadAssignments.fulfilled, (state, action) => {
        state.items = action.payload;
        state.status = 'succeeded';
      })
      .addCase(loadAssignments.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload ?? 'Không thể tải bài tập.';
      }),
});
export const { addAssignment, toggleAssignment, deleteAssignment, setStorageError } =
  assignmentsSlice.actions;
export default assignmentsSlice.reducer;
