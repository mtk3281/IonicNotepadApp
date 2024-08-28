import { Component } from '@angular/core';
import { PopoverComponent } from '../popover/popover.component';
import { PopoverController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { Router } from '@angular/router';
import { NotesService } from '../notes.service';
import { Share } from '@capacitor/share';
import { ToastController } from '@ionic/angular';
import { Location } from '@angular/common';

@Component({
  selector: 'app-create-new-note',
  templateUrl: './create-new-note.page.html',
  styleUrls: ['./create-new-note.page.scss'],
})
export class CreateNewNotePage {

 
 editorStyle = {
  height: 'calc(100vh - 60px)',
  backgroundColor: 'white',
  color: 'black',
  fontSize: 'medium',  
  padding: '4px', 
};

  currentDate: Date;
  noteId: string | undefined;
  noteTitle: string = '';
  noteContent: string = '';
  noteColor: string = '';
  bColor: string = '';
  selectedDate: string = ''; 

  // colors which can be used to change the background color of the note
  private colors = [
    '#d4e5ff'
  ];
  
  /* constructor which initializes the required services and the router
   it also checks if the note is being edited or created
   if the note is being edited, it sets the noteId, noteTitle, noteContent, and currentDate
   if the note is being created, it sets the currentDate
   it also assigns a random color to the note   */

  constructor(
    private popoverController: PopoverController, 
    private storage: Storage, 
    private router: Router, 
    private notesService: NotesService,
    private toastController: ToastController,
    private location: Location

  ) {
    this.storage.create(); 

    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as { [key: string]: any } | undefined;
  
    if (state) {
      const note = state['note'] as { id: string, title: string; content: string, date?: string } | undefined;
      if (note) {
        this.noteId = note.id;
        this.noteTitle = note.title || '';
        this.noteContent = note.content || '';

        this.currentDate = note.date ? new Date(note.date) : new Date();
      } else {
        this.currentDate = new Date(); 
      }
  

      const passedDate = state['date'] as string | undefined;
      if (passedDate) {
        this.currentDate = new Date(passedDate);
      }
    } else {
      this.currentDate = new Date();
    }
    console.log('Current Date in CreateNewNotePage:', this.currentDate);

  }

  // assigns a color to the note if the note is being created
  ngOnInit() {
    if (!this.noteId) {
      this.assignColor();
    } else {
      
      this.bColor = this.darkenColor(this.noteColor, 0.2);
    }
  }

  assignColor() {
    this.noteColor = this.colors[Math.floor(Math.random() * this.colors.length)];
    this.bColor = this.darkenColor(this.noteColor, 0.2); 
  }

  // note saving function which save the note using notesService
  async saveNote() {
    const note = {
      id: this.noteId || 'note_' + Date.now(),
      title: this.noteTitle,
      content: this.noteContent,
      date: this.currentDate.toISOString(), 
      color: this.noteColor,
      bcolor: this.bColor, 
      isArchived: false
    };
    await this.notesService.saveNote(note);
    this.presentToast('Note created successfully.');  
    this.location.back();
  }
  
  // function to find the color of the border of the note
  darkenColor(color: string, percent: number): string {
    let r = parseInt(color.slice(1, 3), 16);
    let g = parseInt(color.slice(3, 5), 16);
    let b = parseInt(color.slice(5, 7), 16);

    r /= 255;
    g /= 255;
    b /= 255;
  
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0; 
    let s, l = (max + min) / 2;
  
    if (max === min) {
      s = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }
  
    l = l * (1 - percent);
  
    let q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    let p = 2 * l - q;
    r = Math.round(this.hueToRgb(p, q, h + 1/3) * 255);
    g = Math.round(this.hueToRgb(p, q, h) * 255);
    b = Math.round(this.hueToRgb(p, q, h - 1/3) * 255);
  
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()}`;
  }
  
  hueToRgb(p: number, q: number, t: number): number {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1/6) return p + (q - p) * 6 * t;
    if (t < 1/2) return q;
    if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
    return p;
  }

  // popover function which opens the popover which can be used to delete or share the note  
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

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,  
      position: 'bottom',  
      color: 'dark',  
      cssClass: 'toast-custom',
    });
    toast.present();
  }


  async deleteNote() {
    if (this.noteId) {
      await this.storage.remove(this.noteId);
    }
    this.noteTitle = '';
    this.noteContent = '';
    this.router.navigate(['/notes']);
    this.presentToast('Note deleted successfully.');  // Show toast message

  }

  // function to convert html to text 
  private htmlToText(html: string): string {
    const temporaryElement = document.createElement('div');
    temporaryElement.innerHTML = html;
    return temporaryElement.textContent || temporaryElement.innerText || '';
  }

  //function to share the note using capacitor share module 
  async shareNote() {
    try {
      const plainTextContent = this.htmlToText(this.noteContent);
      
      await Share.share({
        title: this.noteTitle,
        text: `Title: ${this.noteTitle}\n\nContent:\n${plainTextContent}`,
        dialogTitle: 'Share Note'
      });
    } catch (error) {
      console.error('Error sharing note:', error);
    }
  }

}
