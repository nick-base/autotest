import { useMemo } from 'react';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { configureStore, combineReducers, ThunkAction, Action } from '@reduxjs/toolkit';
import { FLUSH, PAUSE, PERSIST, persistReducer, PURGE, REGISTER, REHYDRATE } from 'redux-persist';
import { localStoreAdapter, sessionStoreAdapter } from '../utils/storage';

import globalSlice from './slice.global';
import sessionSlice from './slice.session';
import stateSlice from './slice.state';

const persistValueConfig = {
  key: 'global',
  storage: localStoreAdapter,
  debug: false,
  serialize: false,
  deserialize: false,
};

const persistSessionConfig = {
  key: 'session',
  storage: sessionStoreAdapter,
  debug: false,
  serialize: false,
  deserialize: false,
};

const reducer = combineReducers({
  state: stateSlice,
  global: persistReducer(persistValueConfig, globalSlice),
  session: persistReducer(persistSessionConfig, sessionSlice),
});

export function makeStore(preloadedState) {
  return configureStore({
    reducer,
    preloadedState,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }),
  });
}

let store: ReturnType<typeof makeStore>;

export const initializeStore = (preloadedState) => {
  let _store = store ?? makeStore(preloadedState);

  // After navigating to a page with an initial Redux state, merge that state
  // with the current state in the store, and create a new store
  if (preloadedState && store) {
    _store = makeStore({
      ...store.getState(),
      ...preloadedState,
    });
    // Reset the current store
    store = undefined;
  }

  // For SSG and SSR always create a new store
  if (typeof window === 'undefined') return _store;
  // Create the store once in the client
  if (!store) store = _store;

  return _store;
};

export function useStore(initialState) {
  const store = useMemo(() => initializeStore(initialState), [initialState]);
  return store;
}

export type AppState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, AppState, unknown, Action<string>>;

export const useAppDispatch = () => useDispatch<AppDispatch>();

export const useAppSelector: TypedUseSelectorHook<AppState> = useSelector;
