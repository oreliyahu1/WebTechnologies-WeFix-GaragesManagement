import { Component, Input } from '@angular/core';

@Component({
	templateUrl: './alert.component.html',
	styleUrls: ['./alert.component.css']
})

export class AlertComponent {
	@Input() altRes : string;
	@Input() altMessage : string;
}