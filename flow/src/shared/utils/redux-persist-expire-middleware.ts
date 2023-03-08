import type { Middleware } from 'redux';
import { PersistedState, PersistMigrate, PERSIST, REHYDRATE } from 'redux-persist';
import { localStore } from './store';

export function createReduxPersistExpireMiddleware(options: { expireIn: number }) {
  const { expireIn } = options;
  const expirationKey = 'expirationAt';
  const expirationTime = localStore.get(expirationKey);
  const isExpired = !!expirationTime && expirationTime < new Date().getTime();

  const migrate: PersistMigrate = (state: PersistedState) => {
    return isExpired ? Promise.reject({ state, message: '缓存失效' }) : Promise.resolve(state);
  };

  const middleware: Middleware = () => {
    return (next) => (action) => {
      if (![PERSIST, REHYDRATE].includes(action.type)) {
        localStore.set(expirationKey, new Date().getTime() + expireIn);
      }

      return next(action);
    };
  };

  return {
    migrate,
    middleware,
  };
}
