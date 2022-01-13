import { Component, Inject, Optional } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { first } from 'rxjs/operators';
import { Employee, Garage } from '@app/_models'
import { GarageService, UserService } from '@app/_services';

@Component({
  selector: 'app-user-dialog-box',
  templateUrl: './user-dialog-box.component.html',
  styleUrls: ['./user-dialog-box.component.css']
})

export class UserDialogBoxComponent {
  action:string;
  local_data:any;
  newPassword : string;
  statusList :string[];
  selectedStatus: string;
  garageList:Garage[];
  selectedGarage: Garage;

  constructor(private dialogRef: MatDialogRef<UserDialogBoxComponent>,
    private garageService:GarageService,
    private userService: UserService,
    //@Optional() is used to prevent error if no data is passed
    @Optional() @Inject(MAT_DIALOG_DATA) public data: Employee) {
    this.local_data = {...data};
    this.action = this.local_data.action;
    if(this.action == 'Permission'){
      switch(String(this.userService.getUserPermission())){
        case 'Admin':
          this.statusList = ['New Employee','Employee', 'Manager', 'None'];
          this.getGarages();
          break;
        case 'Manager':
          this.statusList = ['New Employee', 'None'];
          break;
        default:
          break;
      }
    }
    this.newPassword = this.createPassword();
  }
 
  doAction(){
    if(this.action == "ResetPassword"){
      this.local_data.password = this.newPassword;
    }

    if(this.action == 'Permission'){
      this.local_data.status = this.selectedStatus;
      if(this.selectedStatus != 'None' && this.selectedStatus != 'New Employee')
        this.local_data.garage = this.selectedGarage._id;
      else
        this.local_data.garage = null;
    }

    this.dialogRef.close({event: this.action, data: this.local_data});
  }
 
  closeDialog(){
    this.dialogRef.close({event:'Cancel'});
  }
 
  createPassword(){
    var generate = (
      length = 5,
      wishlist = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz~!@-#$"
    ) => Array(length)
          .fill('') // fill an empty will reduce memory usage
          .map(() => wishlist[Math.floor(crypto.getRandomValues(new Uint32Array(1))[0] / (0xffffffff + 1) * wishlist.length)])
          .join('');
    return 'A1!' + generate();
  }

  getGarages(){
    this.garageService.getAll().pipe(first())
		.subscribe(data => {
        this.garageList=data;
		});
  }
}