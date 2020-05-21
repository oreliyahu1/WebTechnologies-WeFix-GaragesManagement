import { Component, Inject, Optional } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Garage , Location } from '@app/_models'
import { UserService } from '@app/_services';

@Component({
  selector: 'app-map-dialog-box',
  templateUrl: './map-dialog-box.component.html',
  styleUrls: ['./map-dialog-box.component.css']
})

export class MapDialogBoxComponent {
  action:string;
  local_data:Garage;
  action_data: Garage;
  index: number;
  
  constructor(private dialogRef: MatDialogRef<MapDialogBoxComponent>,
    private userService : UserService,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any) {  
    this.action = data[1];
    this.local_data=data[0];
    this.action_data = new Garage();
    this.action_data.location = new Location();
    if((this.action == "Edit") || (this.action == "View")){
      this.index=data[2];
      this.action_data = this.local_data[this.index];
    }
  }
 
  canEdit(){
    return (this.userService.getUserPermission() == 'Admin')
  }

  doAction(){
   this.dialogRef.close({event:this.action,data:this.action_data});
  }
 
  closeDialog(){
    this.dialogRef.close({event:'Cancel'});
  }

  deleteAction(){
    this.action="Delete";
    this.doAction();
  }

  onSelection(e, v){
    this.action_data = e.option.value;
  }

  checkpermission(){
    return (this.userService.getUserPermission());
  }
}