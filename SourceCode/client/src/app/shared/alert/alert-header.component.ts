import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { ViewContainerRef, ComponentFactoryResolver, ComponentFactory, ComponentRef, ViewChild } from '@angular/core';
import { ModalService } from '@app/shared/_modal';
import { AlertComponent } from './alert.component';
import { SharedService } from '../shared.service';

@Component({
  selector: 'app-alert-header',
  templateUrl: './alert-header.component.html',
  styleUrls: ['./alert-header.component.css']
})

export class AlertHeaderComponent {
  clickEventsubscription:Subscription
  
	@ViewChild("Alert", { read: ViewContainerRef }) alertContainer;
	componentRef: ComponentRef<AlertComponent>;

  alertcss: any;
	constructor(private modalService: ModalService,
    private componentFactoryResolver: ComponentFactoryResolver,
    private sharedService:SharedService) {
      this.clickEventsubscription=this.sharedService.getAlertEvent().subscribe(val => {
        this.openAlert(val);
      });
  }

  openAlert(val : any) {
		this.componentRef && this.componentRef.destroy();
    const factory: ComponentFactory<any> = this.componentFactoryResolver.resolveComponentFactory(AlertComponent);
    this.componentRef = this.alertContainer.createComponent(factory);
    this.componentRef.instance.altMessage = val.msg;
    this.componentRef.instance.altRes = val.response;
    this.alertcss = {'alert': true};
    this.alertcss[val.response.toLocaleLowerCase()] = true;
    this.modalService.open('custom-modal-alert');
    
    setTimeout(() => {  this.closeAlert() }, 1000);
	}

  closeAlert() {
    this.modalService.close('custom-modal-alert');
  }
}