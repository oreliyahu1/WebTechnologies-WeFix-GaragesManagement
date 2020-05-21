import { NG_VALIDATORS,Validator,ValidationErrors, ValidatorFn, AbstractControl,FormControl } from '@angular/forms';
import { Directive } from '@angular/core';

@Directive({
  selector: '[validpassword]',
  providers: [
    { provide: NG_VALIDATORS, useExisting: PassValidator, multi: true }
  ]
})

export class PassValidator implements Validator {
  validate(c: FormControl): ValidationErrors | null {
    return PassValidator.patternValidator(c);
  }

  static patternValidator(control: AbstractControl): { [key: string]: boolean } | null {
    if(control.value.match(/^$/)){                                                      //must not be empty 
      return {minlength: false}
    } else if(control.value.length<6){                                                 //Must have an minimum of 6 characters                                                     
      return {minlength: true}
    } else if (!control.value.match(/^(?=.*[A-Z])/)){                                 //Must Include an Uppercase Character
      return {NoUppercaseCharacter: true}
  	} else if (!control.value.match(/^(?=.*[a-z])/)){                                //Must Include an Lowercase Character
      return {NoLowercaseCharacter: true}
	  } else if (!control.value.match(/^(?=.*\d)/)){                                  //Must Include a Number
      return {NoNumberCharacter: true}
   	} else if (!control.value.match(/^(?=.*[-!$%^&*()_+|~=`{}\[\]:\/;<>?,.@#])/)){ //Must Include a Special Character (!, @, #, etc.)
      return {NoSpecialCharacter: true}
    }
    return null;
  }
}