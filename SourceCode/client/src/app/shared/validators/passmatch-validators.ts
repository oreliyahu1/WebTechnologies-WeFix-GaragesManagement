import { NG_VALIDATORS } from '@angular/forms';
import { Directive } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Directive({
  selector: '[validpassword]',
  providers: [
    { provide: NG_VALIDATORS, useExisting: PassMatchValidator, multi: true }
  ]
})

export class PassMatchValidator {
  // custom validator to check that two fields match
  static passwordMatchValidator(Passcontrol: string, Cpasscontrol: string) {
    return (formGroup: FormGroup) => {
        const control = formGroup.controls[Passcontrol];
        const matchingControl = formGroup.controls[Cpasscontrol];

        if (matchingControl.errors && !matchingControl.errors.passwordMatchValidator) {
            // return if another validator has already found an error on the matchingControl
            return;
        }
        // set error on matchingControl if validation fails
        if (control.value !== matchingControl.value) {
            matchingControl.setErrors({ NoPassswordMatch: true });
        } else {
            matchingControl.setErrors(null);
        }
    }
  }
}