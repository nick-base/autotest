import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { AppState } from './store';

interface State {
  counter: number;
}

const initialState: State = {
  counter: 0,
};

const name = 'state';

export const slice = createSlice({
  name,
  initialState,
  reducers: {
    incrementSession: (state, action: PayloadAction<number>) => {
      state.counter += action.payload || 1;
    },
  },
});

export const sessionCounterSelecter = (state: AppState) => state.session.counter;

export const { incrementSession } = slice.actions;

export default slice.reducer;
