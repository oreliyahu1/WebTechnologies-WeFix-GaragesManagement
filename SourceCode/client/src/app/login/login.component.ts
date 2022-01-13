import { Component, OnInit, ViewContainerRef, ComponentFactoryResolver, ComponentFactory, ComponentRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { PassValidator } from '@app/shared/validators'
import { ForgotPasswordComponent } from './forgotpassword.component';
import { ModalService } from '@app/shared/_modal';
import { UserService } from '@app/_services';
import { SharedService } from '@app/shared/shared.service';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {
	title = 'Login';
	loginForm: FormGroup;
    loading = false;
    submitted = false;
	returnUrl: string;
	
	@ViewChild("EmailForgot", { read: ViewContainerRef }) container;
	@ViewChild("Alert", { read: ViewContainerRef }) alertContainer;
	componentRef: ComponentRef<any>;
	passType: string = 'password';

	constructor(
        private formBuilder: FormBuilder,
		private router: Router,
		private modalService: ModalService,
		private componentFactoryResolver: ComponentFactoryResolver,
		private userService : UserService,
		private sharedService:SharedService,
    ) {
	}
	
	openModal(id: string) {
		this.componentRef && this.componentRef.destroy();
		const factory: ComponentFactory<any> = this.componentFactoryResolver.resolveComponentFactory(ForgotPasswordComponent);
		this.componentRef = this.container.createComponent(factory);
		this.modalService.open(id);
    }

    closeModal(id: string) {
        this.modalService.close(id);
	}
	
	showPassword() {
		if(this.passType == 'text'){
			this.passType = 'password';
		}else{
			this.passType = 'text';
		}
	}

	ngOnInit() {
		this.loginForm = this.formBuilder.group({
			email: ['', {validators: [ Validators.required, Validators.email], updateOn:'change'}],
			password: ['', {validators: [ Validators.required, PassValidator.patternValidator], updateOn:'change'}]
		});
	}

	isFieldValid(field: string) {
		return (
			(!this.loginForm.get(field).valid && this.loginForm.get(field).touched) ||
			(this.loginForm.get(field).untouched && this.submitted)
		);
	  }
	
	displayFieldCss(field: string) {
		if(this.loginForm.get(field).pristine){
			return;
		}
		return {
			'form-group': true,
			'has-error': this.isFieldValid(field),
			'has-success' : !this.isFieldValid(field)
		};
	}

	onSubmit() {
		this.submitted = true;
		
        if (this.loginForm.invalid || this.loading) {
            return;
		}

		this.loading = true;
		this.userService.login(this.loginForm.value).pipe(first())
		.subscribe(data => {
			this.sharedService.sendAlertEvent(data);
			if(data.response == 'Success'){
				if(this.userService.isLoggin()){
					this.sharedService.sendLoginState(this.userService.getUserPermission());
					setTimeout(() => {  this.router.navigate(['/panel']); }, 1000);
				}
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
}
