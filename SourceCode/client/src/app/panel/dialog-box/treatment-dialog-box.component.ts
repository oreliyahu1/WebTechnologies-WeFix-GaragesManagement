import { Component, Inject, Optional } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Treatment } from '@app/_models'
import { UserService } from '@app/_services';
 
@Component({
  selector: 'app-treatment-dialog-box',
  templateUrl: './treatment-dialog-box.component.html',
  styleUrls: ['./treatment-dialog-box.component.css']
})

export class TreatmentDialogBoxComponent {
  action:string;
  local_data:any;
 
  constructor(private dialogRef: MatDialogRef<TreatmentDialogBoxComponent>, 
    private userService : UserService,
    //@Optional() is used to prevent error if no data is passed
    @Optional() @Inject(MAT_DIALOG_DATA) public data: Treatment) {
    this.local_data = {...data};
    this.action = this.local_data.action;
  }
 
  doAction(){
    this.local_data.garage = Number(this.userService.currentUserValue.garage)
    this.dialogRef.close({event:this.action,data:this.local_data});
  }
 
  closeDialog(){
    this.dialogRef.close({event:'Cancel'});
  }
}