import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { PassValidator, PassMatchValidator } from '@app/shared/validators'
import { trigger, transition, animate, style, state } from '@angular/animations'
import { EmployeeService, UserService } from '@app/_services';
import { SharedService } from './../shared/shared.service';
import { Employee } from '@app/_models';

@Component({
	selector: 'app-account',
	templateUrl: './account.component.html',
	styleUrls: ['./account.component.css'],
	animations: [
        trigger('openClose', [
            state('open', style({
                height: '*',
                opacity: 0.75,
            })),
            state('closed', style({
                height: '0',
                opacity: 0,
            })),
            transition('open => closed', [
                animate('0.35s')
            ]),
            transition('closed => open', [
                animate('0.35s')
            ]),
        ]),
    ]
})

export class AccountComponent implements OnInit {
	title = 'account';
	accountForm: FormGroup;
	passwordForm: FormGroup;
	user: Employee;
	loading = false;
	submitted = false;
	check = false;
	visible :boolean = false;
	showCardBody = false;

	constructor(private formBuilder: FormBuilder,
		private userService : UserService,
		private employeeService : EmployeeService,
		private sharedService:SharedService,
    ) {
	}
	
	ngOnInit() {
		this.accountForm = this.formBuilder.group({
			_id: ['', {validators: [ Validators.required], updateOn:'change'}],
			firstname: ['', {validators: [ Validators.required], updateOn:'change'}],
			lastname: ['', {validators: [ Validators.required], updateOn:'change'}],
			email: ['', {validators: [ Validators.required,Validators.email], updateOn:'change'}],
		});
	    
		this.passwordForm = this.formBuilder.group({
			password: ['', {validators: [ Validators.required,PassValidator.patternValidator], updateOn:'change'}],
			cpassword:['', {validators: [ Validators.required], updateOn:'change'}]},{ 
		    validator: PassMatchValidator.passwordMatchValidator('password','cpassword',)
		});
		this.user = { ...this.userService.currentUserValue};
		delete this.user.token;
	}


	isFieldValid(field: string) {
		if(!this.showCardBody)
			return ((!this.accountForm.get(field).valid && this.accountForm.get(field).touched)||(this.accountForm.get(field).untouched && this.submitted));
		else
		  return ((!this.passwordForm.get(field).valid && this.passwordForm.get(field).touched)||(this.passwordForm.get(field).untouched && this.submitted));
	}
	
	displayFieldCss(field: string) {
		if(!this.showCardBody){
			if ((this.accountForm.get(field)) && (this.accountForm.get(field).pristine || this.accountForm.get(field).untouched)){
				return;
			}
		}

		if(this.showCardBody){
		
			if ((this.passwordForm.get(field)) && (this.passwordForm.get(field).pristine || this.passwordForm.get(field).untouched)){
				return;
			}
		}

		this.check = this.isFieldValid(field);
		return {
			'form-group': true,
			'has-error': this.check,
			'has-success' : !this.check
		};
	}
	
	geterror(field: string) {
        if(field =='cpassword' && this.passwordForm.get(field).touched){
			if(this.passwordForm.controls['cpassword'].hasError('NoPassswordMatch')){
				return "Password does't match!";
			}
			return "Please valid password";
		}
		
		if(field =='password' && this.passwordForm.get(field).touched){
			if(this.passwordForm.controls['password'].hasError('minlength')){
				return "Minimun length is 6!";
			}else if(this.passwordForm.controls['password'].hasError('NoUppercaseCharacter')){
				return "Enter Upper case Character!";
			}else if(this.passwordForm.controls['password'].hasError('NoLowercaseCharacter')){
				return "Enter Lower case Character!";
			}else if(this.passwordForm.controls['password'].hasError('NoNumberCharacter')){
				return "Enter Number case Character!";
			}else if(this.passwordForm.controls['password'].hasError('NoSpecialCharacter')){
				return "Enter Special case Character!";
			}}

			return "Please enter password";	
	}

	onSubmit() {
        if (!this.showCardBody && this.accountForm.invalid) {
            return;
        }else if(this.showCardBody && this.passwordForm.invalid){
			return;
		}
		if(this.loading){
			return;
		}

		if(this.showCardBody){
			this.user.password=this.passwordForm.get('password').value;
			var userevent = { ...this.user, action: 'Edit'};
		}else{
			this.user.firstname = this.accountForm.get('firstname').value;
			this.user.lastname = this.accountForm.get('lastname').value;
			this.user.email = this.accountForm.get('email').value;
			var userevent = { ...this.user, action: 'Edit'};
		}
		
		this.loading = true;
		this.employeeService.update(userevent).pipe(first())
		.subscribe(data => {
			this.sharedService.sendAlertEvent(data);
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
		this.accountForm.reset();
		this.submitted = false;
	}

	visibleChange(){
		this.showCardBody = !this.showCardBody;
		if(this.showCardBody)
			this.visible=false;
		else
			this.visible=true;

		this.ngOnInit();
	  }
}
