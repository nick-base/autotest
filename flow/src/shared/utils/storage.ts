import { Storage } from 'redux-persist';
import store, { localStore, sessionStore } from './store';

export const storeAdapter: Storage = {
  async setItem(key: string, value: any) {
    store.set(key, value);
  },
  async getItem(key: string) {
    return store.get(key);
  },
  async removeItem(key: string) {
    store.remove(key);
  },
};

export const localStoreAdapter: Storage = {
  async setItem(key: string, value: any) {
    localStore.set(key, value);
  },
  async getItem(key: string) {
    return localStore.get(key);
  },
  async removeItem(key: string) {
    localStore.remove(key);
  },
};

export const sessionStoreAdapter: Storage = {
  async setItem(key: string, value: any) {
    sessionStore.set(key, value);
  },
  async getItem(key: string) {
    return sessionStore.get(key);
  },
  async removeItem(key: string) {
    sessionStore.remove(key);
  },
};
