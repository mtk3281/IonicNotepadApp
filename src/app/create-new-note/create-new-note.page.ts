import { Component } from '@angular/core';
import { PopoverComponent } from '../popover/popover.component';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-create-new-note',
  templateUrl: './create-new-note.page.html',
  styleUrls: ['./create-new-note.page.scss'],
})
export class CreateNewNotePage {
  currentDate: Date;

  constructor(private popoverController: PopoverController) {
    this.currentDate = new Date();
  }

  // Method to save the note
  saveNote() {
    console.log('Note saved!');
    // Add your save note logic here
  }

  // Method to present the popover
  async presentPopover(ev: any) {
    const popover = await this.popoverController.create({
      component: PopoverComponent,
      event: ev,
      translucent: true
    });
    return await popover.present();
  }
}

