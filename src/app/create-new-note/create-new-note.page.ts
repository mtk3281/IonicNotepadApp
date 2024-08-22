import { Component } from '@angular/core';
import { PopoverComponent } from '../popover/popover.component';
import { PopoverController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { Router } from '@angular/router';
import { NotesService } from '../notes.service';

@Component({
  selector: 'app-create-new-note',
  templateUrl: './create-new-note.page.html',
  styleUrls: ['./create-new-note.page.scss'],
})
export class CreateNewNotePage {
  currentDate: Date;

  noteTitle: string = '';
  noteContent: string = '';
  
  constructor(private popoverController: PopoverController, private storage: Storage, private router: Router, private notesService: NotesService) {
    this.storage.create(); 
    this.currentDate = new Date();
  }

  async saveNote() {
    const note = {
      title: this.noteTitle,
      content: this.noteContent,
      date: new Date()
    };
    await this.notesService.saveNote(note);
    this.router.navigate(['/notes']);
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

