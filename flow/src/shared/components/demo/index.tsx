import { useEffect } from 'react';
import { timeStampSelecter, counterSelecter, increment, initAsync } from '@/shared/store/slice.global';
import { stateCounterSelecter, incrementValue } from '@/shared/store/slice.state';
import { sessionCounterSelecter, incrementSession } from '@/shared/store/slice.session';

import { useAppSelector, useAppDispatch } from '@/shared/store';

const Demo = () => {
  const counter = useAppSelector(counterSelecter);
  const timeStamp = useAppSelector(timeStampSelecter);
  const stateCounter = useAppSelector(stateCounterSelecter);
  const sessionCounter = useAppSelector(sessionCounterSelecter);

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(initAsync());
  }, []);

  const onClick = () => {
    const num = Math.floor(Math.random() * 10);
    dispatch(increment(num));
    dispatch(incrementValue(num));
    dispatch(incrementSession(num));
  };

  return (
    <div>
      <div>{timeStamp ? new Date(timeStamp).toLocaleDateString() : ''}</div>
      <div>state Counter: {stateCounter}</div>
      <div>local counter: {counter}</div>
      <div>session Counter: {sessionCounter}</div>
      <button onClick={onClick}>random add</button>
    </div>
  );
};

export default Demo;
