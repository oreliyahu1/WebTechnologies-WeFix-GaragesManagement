import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { PassValidator, PassMatchValidator } from '@app/shared/validators'
import { UserService } from '@app/_services';
import { SharedService } from '@app/shared/shared.service';

@Component({
	selector: 'app-register',
	templateUrl: './register.component.html',
	styleUrls: ['./register.component.css']
})

export class RegisterComponent implements OnInit {
	title = 'Register';
	registerForm: FormGroup;
    loading = false;
	submitted = false;
	check: boolean;

	constructor(private formBuilder: FormBuilder,
		private router: Router,
		private userService : UserService,
		private sharedService:SharedService
    ) {
	}
	
	ngOnInit() {
		this.registerForm = this.formBuilder.group({
			firstname: ['', {validators: [ Validators.required], updateOn:'change'}],
			lastname: ['', {validators: [ Validators.required], updateOn:'change'}],
			email: ['', {validators: [ Validators.required,Validators.email], updateOn:'change'}],
			password: ['', {validators: [ Validators.required,PassValidator.patternValidator], updateOn:'change'}],
			cpassword:['', {validators: [ Validators.required], updateOn:'change'}]},{ 
		    validator: PassMatchValidator.passwordMatchValidator('password','cpassword',)
	    });
	}


	isFieldValid(field: string) {
		return (
			(!this.registerForm.get(field).valid && this.registerForm.get(field).touched) ||
			(this.registerForm.get(field).untouched && this.submitted)
		);
	}
	
	displayFieldCss(field: string) {
		if(this.registerForm.get(field).pristine || this.registerForm.get(field).untouched){
			return;
		}

		this.check = this.isFieldValid(field);
		return {
			'form-group': true,
			'has-error': this.check,
			'has-success' : !this.check
		};
	}

	geterror(field: string) {
        if(field =='cpassword' && this.registerForm.get(field).touched){
			if(this.registerForm.controls['cpassword'].hasError('NoPassswordMatch')){
				return "Password does't match!";
			}
			return "Please valid password";
		}

		if(field =='password' && this.registerForm.get(field).touched){
			if(this.registerForm.controls['password'].hasError('minlength')){
				return "Minimun length is 6!";
			}else if(this.registerForm.controls['password'].hasError('NoUppercaseCharacter')){
				return "Enter Upper case Character!";
			}else if(this.registerForm.controls['password'].hasError('NoLowercaseCharacter')){
				return "Enter Lower case Character!";
			}else if(this.registerForm.controls['password'].hasError('NoNumberCharacter')){
				return "Enter Number case Character!";
			}else if(this.registerForm.controls['password'].hasError('NoSpecialCharacter')){
				return "Enter Special case Character!";
			}}
			return "Please enter password";	
	}

	onSubmit() {
        this.submitted = true;

        // stop here if form is invalid
        if (this.registerForm.invalid || this.loading) {
            return;
		}
		
		this.loading = true;
		this.userService.signup(this.registerForm.value)
		.pipe(first())
		.subscribe(data => {
			//this.alertService.success('Registration successful', true);
			this.sharedService.sendAlertEvent(data);
			if(data.response == 'Success'){
				setTimeout(() => {  this.router.navigate(['/login']); }, 1000);
			}
		});
		this.loading = false;
	}
	
	validateAllFormFields(formGroup: FormGroup) {
		Object.keys(formGroup.controls).forEach(field => {
		  const control = formGroup.get(field);
		  if (control instanceof FormControl) {
			control.markAsTouched({ onlySelf: true });
		  } else if (control instanceof FormGroup) {
			this.validateAllFormFields(control);
		  }
		});
	}
	  
	reset() {
		this.registerForm.reset();
		this.submitted = false;
	}
}