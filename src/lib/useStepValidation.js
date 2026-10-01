import { useState } from 'react';
import { validateCampaign } from './campaign';
export default function useStepValidation(data, step, next) {
  const [showErrors, setShowErrors] = useState(false);
  const errors = showErrors ? validateCampaign(data).filter(error => error.step === step) : [];
  const focusError = error => {
    const element = document.getElementById(error.field) || document.getElementById(`${error.field}-field`);
    element?.scrollIntoView({ behavior: 'auto', block: 'center' });
    element?.focus();
  };
  const advance = () => {
    const currentErrors = validateCampaign(data).filter(error => error.step === step);
    setShowErrors(true);
    if (currentErrors.length) requestAnimationFrame(() => focusError(currentErrors[0]));
    else next();
  };
  return { errors, errorFor: field => errors.find(error => error.field === field)?.message, advance, focusError };
}
