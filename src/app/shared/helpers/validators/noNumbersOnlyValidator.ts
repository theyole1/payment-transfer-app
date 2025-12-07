import { AbstractControl, ValidationErrors } from '@angular/forms';

export function noNumbersOnlyValidator(control: AbstractControl): ValidationErrors | null {
  const value = control.value?.toString().trim();
  if (!value) return null;

  return /^[0-9]+$/.test(value) ? { numbersOnly: true } : null;
}
