import { AbstractControl, FormControl, ValidationErrors, Validators } from "@angular/forms";

const hasValue = (v: any): boolean => v !== undefined && v !== null && `${v}` !== '';

const validatePhoneIT = (value: string): boolean => {
  const maxLength: number = 10 + 2 + 2 ; // Number of digits + 2 for the prefix + 2 for the country code

    if (value.length < 9) return false;

    if (isNaN(Number(value))) return false;

    if (value.length > maxLength) return false;

  return true;
};

export class CustomValidators extends Validators {

  static mustBeArray(control: AbstractControl | FormControl): ValidationErrors | null {
    if (!Array.isArray(control.value)) {
      return { 'mustBeArray': true };
    }

    return null;
  }

  static arrayMinLength(minLength: number): (c: AbstractControl | FormControl) => ValidationErrors | null {
    return (control: AbstractControl | FormControl) => {
      if (!Array.isArray(control.value)) return null;
      if (control.value.length < minLength) {
        return { 'arrayMinLength': true };
      }
      
      return null;
    };
  }

  static validateArray(validator: (c: AbstractControl | FormControl) => ValidationErrors | null): (c: AbstractControl | FormControl) => ValidationErrors | null {
    return (control: AbstractControl | FormControl) => {
      if (!Array.isArray(control.value)) return null;
      const errors: ValidationErrors = {};
      for (const item of control.value) {
        const result = validator(new FormControl(item));
        if (result) {
          Object.assign(errors, result);
        }
      }
      return Object.keys(errors).length ? errors : null;
    };
  }

  static percentage(control: AbstractControl | FormControl): ValidationErrors | null {
    if (hasValue(control.value) && (isNaN(control.value) || control.value < 0 || control.value > 100)) {
      return { 'percentage': true };
    }

    return null;
  }

  static phoneIT(control: AbstractControl | FormControl): ValidationErrors | null {
    const final = (valid: boolean): ValidationErrors|null => valid ? null : { 'phoneIT': true };
    const value = `${control.value}`.trim().replace(/\s+/gm, '').replace(/^\+39/gm, '');
    if (!(hasValue(value))) return final(true);

    return final(validatePhoneIT(value));
    // const maxLength: number = 10 + 2 + 2 ; // Number of digits + 2 for the prefix + 2 for the country code

    // if (value.length < 9) return final(false);

    // if (isNaN(Number(value))) return final(false);

    // if (value.length > maxLength) return final(false);

    // return final(true);
  }

  static instanceof(item: any): (c: AbstractControl | FormControl) => ValidationErrors | null{
    return (control: AbstractControl | FormControl) => {
      if (hasValue(control.value) && !(control.value instanceof item)) {
        return { 'instanceof': true };
      }

      return null;
    }
  }

  static numerical(control: AbstractControl | FormControl): ValidationErrors | null {
    if (hasValue(control.value) && isNaN(control.value)) {
      return { 'numerical': true };
    }

    return null;
  }

  static in(options: any[]): (c: AbstractControl | FormControl) => ValidationErrors | null {
    return this.inclusion(options);
  }

  static inclusion(options: readonly any[] | any[]): (c: AbstractControl | FormControl) => ValidationErrors | null {
    return (control: AbstractControl | FormControl) => {
      if (hasValue(control.value) && !options.includes(control.value)) {
        return { 'inclusion': true };
      }

      return null;
    }
  }
}
