import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { AppState, AppThunk } from './store';
import { GlobalState } from './interface';

const initialState: GlobalState = {
  timeStamp: 0,
  counter: 0,
  members: {
    showDetail: false,
  },
  formValues: null,
  cacheNodeList: [],
};

const name = 'global';

export const initAsync = createAsyncThunk(`${name}/initTimeStamp`, async () => {
  const t = await Promise.resolve(new Date().getTime());
  return t;
});

export const slice = createSlice({
  name,
  initialState,
  reducers: {
    setShowDetail: (state, action: PayloadAction<boolean>) => {
      state.members.showDetail = action.payload;
    },
    increment: (state, action: PayloadAction<number>) => {
      state.counter += action.payload || 1;
    },
    setFormValues: (state, action: PayloadAction<any>) => {
      state.formValues = action.payload;
    },
    setCacheNodeList: (state, action: PayloadAction<any>) => {
      state.cacheNodeList = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(initAsync.pending, (state) => {
        state.timeStamp = 0;
      })
      .addCase(initAsync.fulfilled, (state, action) => {
        state.timeStamp = action.payload;
      });
  },
});

export const counterSelecter = (state: AppState) => state.global.counter;

export const timeStampSelecter = (state: AppState) => state.global.timeStamp;

export const showDetailSelecter = (state: AppState) => state.global.members.showDetail;

export const formValuesSelecter = (state: AppState) => state.global.formValues;

export const cacheNodeListSelecter = (state: AppState) => state.global.cacheNodeList;

export const incrementIfOdd =
  (amount: number): AppThunk =>
  (dispatch, getState) => {
    const currentValue = counterSelecter(getState());
    if (currentValue % 2 === 1) {
      dispatch(increment(amount));
    }
  };

export const { increment, setShowDetail, setFormValues, setCacheNodeList } = slice.actions;

export default slice.reducer;
