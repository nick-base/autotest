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
    incrementValue: (state, action: PayloadAction<number>) => {
      state.counter += action.payload || 1;
    },
  },
});

export const stateCounterSelecter = (state: AppState) => state.state.counter;

export const { incrementValue } = slice.actions;

export default slice.reducer;
