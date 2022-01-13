import { Component,OnInit, ViewChild } from '@angular/core';
import { first } from 'rxjs/operators';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, MatSortable } from '@angular/material/sort';
import { TreatmentDialogBoxComponent } from '../dialog-box/treatment-dialog-box.component';
import { GarageService , UserService ,TreatmentService } from '@app/_services';
import { Treatment , Garage } from '@app/_models';
import { SharedService } from '@app/shared/shared.service';

@Component({
  selector: 'app-treatments',
  templateUrl: './treatments.component.html',
  styleUrls: ['./treatments.component.css']
})

export class TreatmentsComponent implements OnInit {
  displayedColumns: string[] = ['date','id','carid','cost','status','details','action'];
  dataSource = new MatTableDataSource<Treatment>();
  garageList : Garage[];
  selectedGarage : Garage;

  @ViewChild(MatTable,{static:true}) table: MatTable<any>;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  constructor(private dialog: MatDialog,
    private sharedService : SharedService,
    private garageService : GarageService,
    private userService : UserService,
    private treatmentService : TreatmentService){
  }

  ngOnInit() {
    if(this.allGaragesPermission())
     this.getGarages();
    else
      this.refreshTable();
	}

  allGaragesPermission(){
    return this.userService.getUserPermission() == 'Admin';
  }
  
  isSelectedGarage(){
    if(this.allGaragesPermission())
      return this.selectedGarage != null;
    else
      return true;
  }

  getGarageId(){
    if(this.allGaragesPermission())
      return this.selectedGarage._id;
    else
      return Number(this.userService.currentUserValue.garage);
  }

  openDialog(action,obj) {
    obj.action = action;
    const dialogRef = this.dialog.open(TreatmentDialogBoxComponent, {
      width: '250px',
      data:obj
    });
 
    dialogRef.afterClosed().subscribe(result => {
      if(!result) return;
      if(result.event == 'Add'){
        this.addRowData(result.data);
      }else if(result.event == 'Edit'){
        this.updateRowData(result.data);
      }else if(result.event == 'Delete'){
        this.deleteRowData(result.data);
      }
    });
  }
 
  addRowData(row_obj){
    row_obj.garage = this.getGarageId();
    this.treatmentService.add(row_obj).pipe(first())
		.subscribe(data => {
        this.sharedService.sendAlertEvent(data);
        this.refreshTable();
		});
  }

  updateRowData(row_obj){
    row_obj.garage = this.getGarageId();
    this.treatmentService.update(row_obj).pipe(first())
		.subscribe(data => {
        this.sharedService.sendAlertEvent(data);
        this.refreshTable();
			});  
  }

  deleteRowData(row_obj){
    row_obj.garage = this.getGarageId();
    this.treatmentService.delete(row_obj._id).pipe(first())
		.subscribe(data => {
        this.sharedService.sendAlertEvent(data);
        this.refreshTable();
			});
  }

  applyFilter(event: Event) {
		const filterValue = (event.target as HTMLInputElement).value;
		this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  
  private refreshTable() {
    this.garageService.getTreatmentsById(this.getGarageId()).pipe(first())
		.subscribe(data => {
        this.dataSource.data=data;
    });
    this.sort.sort(({ id: 'date', start: 'desc'}) as MatSortable);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;  
  }

  getGarages(){
    this.garageService.getAll().pipe(first())
    .subscribe(data => {
        this.garageList=data;
    });
  }

  public loadGarage(){
    this.refreshTable();
  }
}
 