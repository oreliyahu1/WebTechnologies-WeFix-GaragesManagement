import { Component } from '@angular/core';
import { SharedService } from '../shared/shared.service';

@Component({
	selector: 'app-panel',
	templateUrl: './panel.component.html',
	styleUrls: ['./panel.component.css']
	
})
export class PanelComponent {

  selected:string = 'Income';
  constructor(private SelectService: SharedService) {
    this.SelectService.getSelectMenuEvent().subscribe(res => {
        this.selected = res;
    })
  }

  checkselected(src:string) {
    return (src == this.selected);
  }
}