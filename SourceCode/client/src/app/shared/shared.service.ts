import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { GarageReport } from '@app/_models';

@Injectable({
  providedIn: 'root'
})

export class SharedService{
  alertMessage = new Subject<any>();
  loginState = new Subject<string>();
  selectState = new Subject<string>();
  garageReport = new Subject<GarageReport[]>();

  sendGarageReport(greport : GarageReport[]){
    this.garageReport.next(greport);
  }

  getGarageReportEvent(): Observable<GarageReport[]>{ 
    return this.garageReport.asObservable();
  }

  sendLoginState(status : string){
    this.loginState.next(status);
  }

  getLoginStateEvent(): Observable<string>{ 
    return this.loginState.asObservable();
  }

  sendSelectMenu(selected:string){ 
    this.selectState.next(selected);
  }
  
  getSelectMenuEvent(): Observable<string>{ 
    return this.selectState.asObservable();
  }

  sendAlertEvent(e : any) {
    this.alertMessage.next(e);
  }

  getAlertEvent(): Observable<any>{ 
    return this.alertMessage.asObservable();
  }
}