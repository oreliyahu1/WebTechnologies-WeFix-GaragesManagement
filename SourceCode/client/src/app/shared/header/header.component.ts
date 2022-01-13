import { Component } from '@angular/core';
import { ViewContainerRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})

export class HeaderComponent { 
  @ViewChild("Alert", { read: ViewContainerRef }) alertContainer;
}