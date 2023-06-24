import { NodeElement } from 'rc-tree/lib/interface';
import React, { useRef, useState, useEffect, useMemo } from 'react';

const formatMoment = (ms, type = 'DD HH:mm:ss') => {
  if (ms <= 0)
    return {
      day: 0,
      hour: 0,
      minute: 0,
      second: 0,
    };
  let remainTs = ms;
  let days = 0;
  if (type.indexOf('DD') !== -1) {
    days = Math.floor(ms / 1000 / 3600 / 24);
    remainTs = ms % (24 * 60 * 60 * 1000);
  }
  const hours = Math.floor(remainTs / 60 / 60 / 1000);
  remainTs %= 60 * 60 * 1000;
  const minutes = Math.floor(remainTs / 60 / 1000);
  remainTs %= 60 * 1000;
  const seconds = Math.floor(remainTs / 1000);

  return {
    days,
    hours,
    minutes,
    seconds,
  };
};
/**
 * timeRemaining:剩余时间的时间戳
 * onComplete:倒计时结束的回调
 */
export function useCountdown(currentTimer, lastTimer, onComplete) {
  const timeRemaining = useMemo(() => {
    return currentTimer - new Date().getTime();
  }, [currentTimer]);

  const cancelToken = useRef(false);
  const timer = useRef<any>();
  const [countDownTime, setCountDownTime] = useState(0);
  useEffect(
    () => () => {
      cancelToken.current = true;
    },
    []
  );

  useEffect(() => {
    const count = (remainTs) => {
      if (timer.current) window.clearTimeout(timer.current);
      if (cancelToken.current) return;
      if (remainTs <= 0 && Number(timeRemaining) > 0) {
        window.clearTimeout(timer.current);
        onComplete();
      } else {
        setCountDownTime(remainTs - 1000);
        timer.current = window.setTimeout(() => count(remainTs - 1000), 1000);
      }
    };
    count(timeRemaining);
    return () => {
      window.clearTimeout(timer.current);
    };
  }, [timeRemaining, onComplete]);

  const { days, hours, minutes, seconds } = formatMoment(countDownTime);
  return { days, hours, minutes, seconds };
}

export function useCalcTime(time) {
  const timeRemaining = new Date().getTime() - time;
  if (timeRemaining > 0) {
    const { days, hours, minutes, seconds } = formatMoment(timeRemaining);
    return { days, hours, minutes, seconds };
  }
  return undefined;
}
