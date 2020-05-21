import { Component, OnInit } from '@angular/core';
import { ViewChild } from '@angular/core';
import { first } from 'rxjs/operators';
import { Subscription}  from 'rxjs';
import { Router } from '@angular/router';
import { UserService } from '@app/_services';
import { SharedService } from '@app/shared/shared.service';

@Component({
  selector: 'app-side',
  templateUrl: './side.component.html',
  styleUrls: ['./side.component.css']
})

export class SideComponent implements OnInit {
  @ViewChild('menu') menu;
  selected:string;  //'Income','Treatment','Map','Users','Welcome','Blocked'
  subscription: Subscription;
  router: Router;

  constructor(private userService : UserService, private sharedService : SharedService) {
    this.sharedService.getLoginStateEvent().subscribe(res=> {
      if (res =='Admin' || res =='Manager') {
        
      }else if (res =='Employee'){
        if(this.selected == 'Users'){
          this.firstPage();
          this.sharedService.sendSelectMenu(this.selected); 
        }
      }else if (res =='New Employee'){
        this.firstPage();
        this.sharedService.sendSelectMenu(this.selected); 
      }else if (res =='None'){
        this.firstPage();
        this.sharedService.sendSelectMenu(this.selected);
      }
    });
  }

  ngOnInit(){
    if(this.userService.isLoggin()){
        this.sharedService.sendLoginState(this.userService.getUserPermission());
    }
    this.firstPage();
    this.sharedService.sendSelectMenu(this.selected);
  }
  
  firstPage() {
    switch(String(this.userService.getUserPermission())){
      case 'New Employee':
        this.selected = 'Welcome';
        break;
      case 'None':
        this.selected = 'Blocked';
        break;
      case 'Admin':
        this.selected='Income';
        break;
      case 'Employee':
        this.selected='Income';
        break;
      case 'Manager':
        this.selected='Income';
        break;
      default:
        this.selected = 'Blocked';
        break;
    }
  }

  Select(element:string){
   if(this.selected == element){return};
   this.selected=element;
   this.sharedService.sendSelectMenu(element);
  }

  endsession(){
    this.userService.logout().pipe(first())
    .subscribe(data => {
    }); 
  }

  checkpermission(element:string){
    const permission = this.userService.getUserPermission();
    if(element=="active"){
      return (permission =='Admin' || permission =='Manager' || permission =='Employee');
    }else if(element=="users"){
      return (permission =='Admin' || permission =='Manager');
    }else if(element=="welcome"){
      return (permission =='New Employee');
    }else if(element=="blocked"){
      return (permission =='None');
    }
    return false;
  }
}