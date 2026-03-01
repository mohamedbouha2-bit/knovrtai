"use client";

import { useCallback } from "react"
import { useBoolean } from "./use-boolean"
import { useCounter } from "./use-counter"
import { useInterval } from "./use-interval"

type CountdownOptions = {
  countStart: number
  intervalMs?: number
  isIncrement?: boolean
  countStop?: number
}

type CountdownControllers = {
  startCountdown: () => void
  stopCountdown: () => void
  resetCountdown: () => void
}

/**
 * خطاف مخصص لإدارة العد التنازلي أو التصاعدي.
 * يعتمد على تركيب عدة خطافات مخصصة لإدارة الحالة والوقت.
 */
export function useCountdown({
  countStart,
  countStop = 0,
  intervalMs = 1000,
  isIncrement = false,
}: CountdownOptions): [number, CountdownControllers] {
  const {
    count,
    increment,
    decrement,
    reset: resetCounter,
  } = useCounter(countStart)

  const {
    value: isCountdownRunning,
    setTrue: startCountdown,
    setFalse: stopCountdown,
  } = useBoolean(false)

  const resetCountdown = useCallback(() => {
    stopCountdown()
    resetCounter()
  }, [stopCountdown, resetCounter])

  const countdownCallback = useCallback(() => {
    // التحقق من الوصول لنقطة النهاية قبل التحديث
    if (count === countStop) {
      stopCountdown()
      return
    }

    if (isIncrement) {
      // منع التجاوز في حالة التصاعد
      if (count < countStop) increment()
      else stopCountdown()
    } else {
      // منع التجاوز في حالة التنازل
      if (count > countStop) decrement()
      else stopCountdown()
    }
  }, [count, countStop, decrement, increment, isIncrement, stopCountdown])

  // استخدام useInterval للتحكم في نبضات المؤقت
  useInterval(countdownCallback, isCountdownRunning ? intervalMs : null)

  return [count, { startCountdown, stopCountdown, resetCountdown }]
}

export type { CountdownOptions, CountdownControllers }