import { useEffect } from 'react';
import { useRouter } from 'next/router';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

const useProgress = () => {
  const router = useRouter();

  useEffect(() => {
    const handleStart = (url) => {
      console.info(url);
      NProgress.start();
    };
    const handleStop = () => {
      console.info('end');
      NProgress.done();
    };

    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleStop);
    router.events.on('routeChangeError', handleStop);

    return () => {
      router.events.off('routeChangeStart', handleStart);
      router.events.off('routeChangeComplete', handleStop);
      router.events.off('routeChangeError', handleStop);
    };
  }, [router]);
};

export default useProgress;
