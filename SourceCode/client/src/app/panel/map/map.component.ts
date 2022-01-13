import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { MapDialogBoxComponent } from '../dialog-box/map-dialog-box.component';
import { MatDialog } from '@angular/material/dialog';
import { Garage } from '@app/_models'
import { GarageService, UserService } from '@app/_services';
import { SharedService } from '@app/shared/shared.service';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})

export class MapComponent implements AfterViewInit {
  @ViewChild("mapContainer", { static: false }) gmap: ElementRef;
  map: google.maps.Map;
  israel = {lat: 31.391959, lng: 35.217018};
  garages:Garage[];
  index:number;

  constructor(public dialog: MatDialog,
    private garageService:GarageService,
    private sharedService: SharedService,
    private userService : UserService){
  }

  openDialog(action, i) {
    if((action == "Edit") || (action == "View")){
      var Sendmarkers = [this.garages,action,i]; 
      this.index=i;
    }
    else
    var Sendmarkers = [this.garages,action];
    
    const dialogRef = this.dialog.open(MapDialogBoxComponent, {
      width: '250px',
      data:Sendmarkers
    });
 
    dialogRef.afterClosed().subscribe(result => {
      if(!result) return;
      if(result.event == 'Add'){
        this.AddGarage(result.data, this.garageService, this.sharedService);
      }else if(result.event == 'Edit'){
        this.EditGarage(result.data);
      }else if(result.event == 'Delete'){
        this.DeleteGarage(result.data);
      }
    });
  }
  
  //Coordinates to set the center of the map
  // coordinates = new google.maps.LatLng(this.lat, this.lng);

  mapOptions: google.maps.MapOptions = {
    center: this.israel,
    zoom: 8
  };

  //Default Markers
  markers = [];

  ngAfterViewInit(): void {
    this.mapInitializer();
  }

  mapInitializer(): void {
   this.map = new google.maps.Map(this.gmap.nativeElement, this.mapOptions);
   var select = document.createElement('div');
   this.selectControl(select);
   this.map.controls[google.maps.ControlPosition.LEFT_TOP].push(select);

    this.loadAllMarkers(this.map , this.markers , this.userService.getUserPermission() );
  }

  loadAllMarkers(themap: google.maps.Map, markers , permission): void {
    this.garageService.getAll().pipe(first())
		.subscribe(data => {
        this.garages=data;
        //import marks to map
        var control=this;
        var bounds = new google.maps.LatLngBounds();
        data.forEach(function (marker,i) {
          var position = new google.maps.LatLng(marker.location.position.lat, marker.location.position.lng);
          var mark = new google.maps.Marker({
              position: position,
              map: themap,
              title: marker.name,
              icon:"https://img.icons8.com/dusk/40/000000/car-service.png",
              animation: google.maps.Animation.DROP,
          });

          
          if(permission == 'Admin'){
            mark.addListener('click', function(){
              control.openDialog("Edit",i);
            });
          } else {
            mark.addListener('click', function(){
              control.openDialog("View",i);
            }); 
          }

          markers.push(mark);
          bounds.extend(position);
        });

       // this.map.fitBounds(bounds);  מרכז את המפה סביב הנקודות.

			});
    } 

  selectControl(controlDiv){
    // Set CSS for the control interior.
    var control=this;
    if(this.userService.getUserPermission() == 'Admin'){
    var controlAdd = document.createElement('img');
    controlAdd.style.paddingLeft = '20px';
    controlAdd.style.paddingRight = '35px';
    controlAdd.srcset="./assets/img/plus-emoji.png";
    controlAdd.title ="Add New Garage";
    controlDiv.appendChild(controlAdd);

    controlAdd.addEventListener('mouseenter', function() {
      controlAdd.style.cursor = "pointer";});

    controlAdd.addEventListener('mouseleave', function() {
      controlAdd.style.cursor = "default"});

    controlAdd.addEventListener('click', function() {
      control.openDialog('Add' ,null);});
    }
  }

  findLatLang(address, geocoder) {
    return new Promise(function(resolve, reject) {
        geocoder.geocode({'address': address}, function(results, status) {
            if (status === 'OK') {
                resolve({lat : results[0].geometry.location.lat(), lng: results[0].geometry.location.lng()});
            } else {
                reject(new Error('Couldnt\'t find the location ' + address));
            }
      })
    });
  } 
   

  async AddGarage(garage:any, garageService: GarageService, sharedService: SharedService) {
      var geocoder = new google.maps.Geocoder();
      let locationData = [];
      locationData.push(this.findLatLang(garage.location.street+', '+garage.location.city+', '+garage.location.country, geocoder))
      Promise.all(locationData).then(function(returnVals){
        garage.location.position = returnVals[0]; 
        garageService.add(garage).pipe(first())
        .subscribe(data => {
            sharedService.sendAlertEvent(data);
            this.RemoveAllmarkers();
            this.loadAllMarkers(this.map , this.markers , this.userService.getUserPermission());
            this.map.panTo(returnVals[0]);
        });
      }.bind(this));
  }

  EditGarage(garage:Garage){
    var geocoder = new google.maps.Geocoder();
    let locationData = [];
    locationData.push(this.findLatLang(garage.location.street+', '+garage.location.city+', '+garage.location.country, geocoder))
    Promise.all(locationData).then(function(returnVals){
      garage.location.position = returnVals[0]; 
      this.garageService.update(garage).pipe(first())
      .subscribe(data => {
        this.sharedService.sendAlertEvent(data);  
        this.RemoveAllmarkers();
        this.loadAllMarkers(this.map , this.markers , this.userService.getUserPermission());   
      });
    }.bind(this))
  }
   
  DeleteGarage(garage:Garage){
    this.garageService.delete(garage._id).pipe(first())
    .subscribe(data => {
        this.RemoveAllmarkers();
        this.loadAllMarkers(this.map , this.markers , this.userService.getUserPermission());
        this.sharedService.sendAlertEvent(data);
    });
  }

  RemoveAllmarkers(){
    this.markers.forEach(marker => {
        marker.setMap(null);
    });
    this.markers=[];
    this.garages=[];
  }
}