import { Component } from '@angular/core';
import { PopoverComponent } from '../popover/popover.component';
import { PopoverController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { Router } from '@angular/router';
import { NotesService } from '../notes.service';
import { Share } from '@capacitor/share';

@Component({
  selector: 'app-create-new-note',
  templateUrl: './create-new-note.page.html',
  styleUrls: ['./create-new-note.page.scss'],
})
export class CreateNewNotePage {
  currentDate: Date;
  noteId: string | undefined;
  noteTitle: string = '';
  noteContent: string = '';
  
  constructor(
    private popoverController: PopoverController, 
    private storage: Storage, 
    private router: Router, 
    private notesService: NotesService
  ) {
    this.storage.create(); 
    this.currentDate = new Date();

    // Retrieve the passed note if available
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as { [key: string]: any } | undefined;
    const note = state ? state['note'] as { id: string, title: string; content: string } | undefined : undefined;

    if (note) {
      this.noteId = note.id;
      this.noteTitle = note.title || '';
      this.noteContent = note.content || '';
    }
  }

  async saveNote() {
    const note = {
      id: this.noteId || 'note_' + Date.now(),
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
    popover.onDidDismiss().then((result) => {
      if (result.data?.action === 'delete') {
        this.deleteNote();
      } else if (result.data?.action === 'share') {
        this.shareNote();
      }
    });

    return await popover.present();
  }

  async deleteNote() {
    if (this.noteId) {
      await this.storage.remove(this.noteId);
    }
    this.noteTitle = '';
    this.noteContent = '';
    this.router.navigate(['/notes']);
  }

  // Method to share the note
  async shareNote() {
    try {
      await Share.share({
        title: this.noteTitle,
        text: `Title: ${this.noteTitle}\n\nContent:\n${this.noteContent}`,
        dialogTitle: 'Share Note'
      });
    } catch (error) {
      console.error('Error sharing note:', error);
    }
  }

}
