import { useRef } from 'react';

export default function useRendersCount(): number {
  return ++useRef(0).current;
}
