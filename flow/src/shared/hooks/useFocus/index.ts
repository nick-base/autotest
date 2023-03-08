import { useState } from 'react';

export default function useFocus() {
  const [focused, set] = useState(false);

  return {
    focused,
    bind: {
      onFocus: () => set(true),
      onBlur: () => set(false),
    },
  };
}
