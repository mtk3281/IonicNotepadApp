import { Component } from '@angular/core';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-popover',
  templateUrl: './popover.component.html',
  styleUrls: ['./popover.component.scss'],
})
export class PopoverComponent {

  constructor(private popoverController: PopoverController) {}

  ngOnInit() {}
  // Method to handle the delete action
  onDelete() {
    console.log('Delete clicked!');
    this.popoverController.dismiss();
    // Add your delete logic here
  }

  // Method to handle the share action
  onShare() {
    console.log('Share clicked!');
    this.popoverController.dismiss();
    // Add your share logic here
  }
}

