import { Component } from '@angular/core';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-popover',
  templateUrl: './popover.component.html',
  styleUrls: ['./popover.component.scss'],
})
export class PopoverComponent {

  constructor(private popoverController: PopoverController) {}

  onDelete() {
    console.log('Delete clicked!');
    this.popoverController.dismiss({ action: 'delete' });
  }

  onShare() {
    console.log('Share clicked!');
    this.popoverController.dismiss({ action: 'share' });
  }
  
}

