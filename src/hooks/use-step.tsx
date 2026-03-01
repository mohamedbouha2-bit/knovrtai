"use client";

import { useCallback, useState } from 'react';
import type { Dispatch, SetStateAction } from 'react';

type UseStepActions = {
  goToNextStep: () => void;
  goToPrevStep: () => void;
  reset: () => void;
  canGoToNextStep: boolean;
  canGoToPrevStep: boolean;
  setStep: Dispatch<SetStateAction<number>>;
};

/**
 * خطاف مخصص لإدارة التنقل بين الخطوات في العمليات المتسلسلة.
 * @param maxStep إجمالي عدد الخطوات المتاحة.
 */
export function useStep(maxStep: number): [number, UseStepActions] {
  const [currentStep, setCurrentStep] = useState(1);

  const canGoToNextStep = currentStep < maxStep;
  const canGoToPrevStep = currentStep > 1;

  // تحسين دالة setStep لتكون متوافقة تماماً مع نمط Dispatch<SetStateAction>
  const setStep = useCallback<Dispatch<SetStateAction<number>>>(
    (step) => {
      setCurrentStep((prev) => {
        const newStep = step instanceof Function ? step(prev) : step;

        if (newStep >= 1 && newStep <= maxStep) {
          return newStep;
        }

        console.error(`Step ${newStep} is out of range [1, ${maxStep}]`);
        return prev;
      });
    },
    [maxStep],
  );

  const goToNextStep = useCallback(() => {
    if (canGoToNextStep) {
      setCurrentStep((step) => step + 1);
    }
  }, [canGoToNextStep]);

  const goToPrevStep = useCallback(() => {
    if (canGoToPrevStep) {
      setCurrentStep((step) => step - 1);
    }
  }, [canGoToPrevStep]);

  const reset = useCallback(() => {
    setCurrentStep(1);
  }, []);

  return [
    currentStep,
    {
      goToNextStep,
      goToPrevStep,
      canGoToNextStep,
      canGoToPrevStep,
      setStep,
      reset,
    },
  ];
}

export type { UseStepActions };