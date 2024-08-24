import { Component } from '@angular/core';
import { PopoverComponent } from '../popover/popover.component';
import { PopoverController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { Router } from '@angular/router';
import { NotesService } from '../notes.service';
import { Share } from '@capacitor/share';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-create-new-note',
  templateUrl: './create-new-note.page.html',
  styleUrls: ['./create-new-note.page.scss'],
})
export class CreateNewNotePage {

  quillConfig = {
    toolbar: [
      ['bold', 'italic', 'underline'], 
      [{ 'list': 'ordered'}, { 'list': 'bullet' }], 
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      [{ 'color': [] }, { 'background': [] }],  
      [{ 'indent': '-1'}, { 'indent': '+1' }],
      ['code-block'], 
    ]
  };

 // Customize styles here
 editorStyle = {
  height: 'calc(100vh - 60px)', // Adjust height to fill the screen, minus header/footer height
  backgroundColor: 'white',
  color: 'black',
  fontSize: 'medium',  // Set font size to medium
  padding: '4px', 
};

  currentDate: Date;
  noteId: string | undefined;
  noteTitle: string = '';
  noteContent: string = '';
  noteColor: string = '';
  bColor: string = '';

  private colors = [
    '#f1fff2', '#fedef3', '#fef1de', '#e3f2fd', '#fff9c4', '#f8bbd0', '#d1c4e9'
  ];
  

  constructor(
    private popoverController: PopoverController, 
    private storage: Storage, 
    private router: Router, 
    private notesService: NotesService,
    private toastController: ToastController 

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

  ngOnInit() {
    if (!this.noteId) {
      this.assignColor();
    } else {
      // If editing an existing note, ensure bcolor is set based on the noteColor
      this.bColor = this.darkenColor(this.noteColor, 0.2);
    }
  }
  

  assignColor() {
    // Randomly assign a color from the predefined set
    this.noteColor = this.colors[Math.floor(Math.random() * this.colors.length)];
    this.bColor = this.darkenColor(this.noteColor, 0.2); // Darken by 20%
  }


  async saveNote() {
    const note = {
      id: this.noteId || 'note_' + Date.now(),
      title: this.noteTitle,
      content: this.noteContent,
      date: new Date(),
      color: this.noteColor,
      bcolor: this.bColor,  // Include the border color
    };
    await this.notesService.saveNote(note);
    this.router.navigate(['/notes']);
    this.presentToast('Note created successfully.');  // Show toast message

  }
  


  darkenColor(color: string, percent: number): string {
    // Convert HEX to RGB
    let r = parseInt(color.slice(1, 3), 16);
    let g = parseInt(color.slice(3, 5), 16);
    let b = parseInt(color.slice(5, 7), 16);
  
    // Convert RGB to HSL
    r /= 255;
    g /= 255;
    b /= 255;
  
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0;  // Initialize h to 0 to avoid undefined issues
    let s, l = (max + min) / 2;
  
    if (max === min) {
      s = 0; // achromatic
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
  
    // Darken the lightness by the specified percentage
    l = l * (1 - percent);
  
    // Convert HSL back to RGB
    let q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    let p = 2 * l - q;
    r = Math.round(this.hueToRgb(p, q, h + 1/3) * 255);
    g = Math.round(this.hueToRgb(p, q, h) * 255);
    b = Math.round(this.hueToRgb(p, q, h - 1/3) * 255);
  
    // Convert RGB back to HEX
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

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,  // Duration in milliseconds
      position: 'bottom',  // Position on the screen
      color: 'dark',  // Customize the color if needed
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


  private htmlToText(html: string): string {
    const temporaryElement = document.createElement('div');
    temporaryElement.innerHTML = html;
    return temporaryElement.textContent || temporaryElement.innerText || '';
  }


  async shareNote() {
    try {
      // Convert HTML content to plain text
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
