import { useLayoutEffect } from 'react';

interface Theme {
  [key: string]: string;
}

export default function useTheme(theme: Theme): void {
  useLayoutEffect((): void => {
    for (const key in theme) {
      document.documentElement.style.setProperty(`--${key}`, theme[key]);
    }
  }, [theme]);
}
