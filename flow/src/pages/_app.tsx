import 'antd/dist/antd.css';
import { Provider } from 'react-redux';
import { persistStore } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';
import type { AppProps } from 'next/app';
import { useStore } from '@/shared/store';
import { useProgress } from '@/shared/hooks';

export default function App({ Component, pageProps }: AppProps) {
  const store = useStore(pageProps.initialReduxState);
  const persistor = persistStore(store, {}, function () {
    persistor.persist();
  });

  useProgress();

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {() => <Component {...pageProps} />}
      </PersistGate>
    </Provider>
  );
}
