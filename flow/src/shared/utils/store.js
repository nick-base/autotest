import engine from 'store/src/store-engine';
import localStorage from 'store/storages/localStorage';
import sessionStorage from 'store/storages/sessionStorage';
import memoryStorage from 'store/storages/memoryStorage';
import { getParameterByName, isCookieDisabled } from './tools';

const _localStorage = !isCookieDisabled ? localStorage : memoryStorage;
const _sessionStorage = !isCookieDisabled ? sessionStorage : memoryStorage;

const id = getParameterByName('id') || 'default';

const namespace = `${id}_`;
const nativeLocalStore = engine.createStore(_localStorage);
const nativeSessionStore = engine.createStore(_sessionStorage);

const localStore = engine.createStore(_localStorage, undefined, namespace);
const sessionStore = engine.createStore(_sessionStorage, undefined, namespace);

const ONE_KB = 1024;
const ONE_MB = ONE_KB * 1024;
const MAX_MB = ONE_MB * 3;

if (!isCookieDisabled) {
  setTimeout(() => {
    try {
      let size = 0;
      nativeLocalStore.each((val, key) => {
        size += JSON.stringify(val).length;
        size += JSON.stringify(key).length;
      });

      if (size < MAX_MB) {
        return;
      }

      nativeLocalStore.clearAll();
    } catch (e) {
      console.error(e);
    }
  });
}

export { namespace, localStore, sessionStore, nativeLocalStore, nativeSessionStore };
export default engine.createStore([_sessionStorage, _localStorage], undefined, namespace);
