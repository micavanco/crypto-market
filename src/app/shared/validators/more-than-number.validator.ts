import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function moreThanNumberValidator(minNumber: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const parsedValue = parseFloat(control.value)

    if (isNaN(parsedValue)) {
      return { notNumber: true };
    }

    if (parsedValue <= minNumber) {
      return { shouldBeHigherThan: { value: minNumber } };
    }

    return null;
  };
}
