import { Component, ViewChild, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { StatusBar } from '@capacitor/status-bar';
import { IonMenu } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { NotesService } from '../notes.service';
import { Share } from '@capacitor/share';
import { AlertController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-archive',
  templateUrl: './archive.page.html',
  styleUrls: ['./archive.page.scss'],
})
export class ArchivePage implements OnInit {

  notes: any[] = [];
  selectedNotes: any[] = [];
  filteredNotes: any[] = [];  
  inSelectionMode = false;
 
  @ViewChild('mainMenu', { static: true }) mainMenu!: IonMenu;

  currentPage: string = '';

  constructor(
    private router: Router,
    private storage: Storage,
    private notesService: NotesService,
    private alertController: AlertController,
    private toastController: ToastController,

  ) {
    this.router.events.subscribe(() => {
      this.currentPage = this.router.url.split('/').pop() as string;
    });
  }

  async ngOnInit() {
    await this.storage.create();
    await this.loadNotes();

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        if (event.urlAfterRedirects === '/archive') {  // Check for the correct route
          this.loadNotes();
        }
      }
    });

    await StatusBar.setBackgroundColor({ color: '#ffffff' });
  }

  async loadNotes() {
    try {
      this.notes = await this.notesService.getNotes(true); // Load archived notes
    } catch (error) {
      console.error('Error loading notes:', error);
    }
  }

  openNote(note: any) {
    if (this.inSelectionMode) {
      this.toggleNoteSelection(note);
    } else {
      this.router.navigate(['/create-new-note'], {
        state: {
          note: {
            id: note.id,
            title: note.title,
            content: note.content,
            date: note.date 
          }
        }
      });
    }
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

  navigateTo(page: string) {
    this.router.navigate([page]);
  }

  enterSelectionMode() {
    this.inSelectionMode = true;
  }

  exitSelectionMode() {
    this.inSelectionMode = false;
    this.selectedNotes = [];
  }

  toggleNoteSelection(note: any) {
    const index = this.selectedNotes.indexOf(note);
    if (index > -1) {
      this.selectedNotes.splice(index, 1);
    } else {
      this.selectedNotes.push(note);
    }
  }

  async deleteSelectedNotes() {
    const alert = await this.alertController.create({
      header: 'Confirm Deletion',
      message: 'Are you sure you want to delete the selected notes?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Delete',
          handler: async () => {
            try {
              for (const note of this.selectedNotes) {
                await this.notesService.deleteNoteById(note.id);
              }
              await this.loadNotes(); 
              this.exitSelectionMode();
              this.presentToast('Notes deleted successfully.');
            } catch (error) {
              console.error('Error deleting notes:', error);
              this.presentToast('Error deleting notes.');
            }
          }
        }
      ]
    });
  
    await alert.present();
  }
  
  async unarchiveSelectedNotes() {
    try {
      for (const note of this.selectedNotes) {
        note.isArchived = false;
        await this.notesService.updateNote(note);
      }
      await this.loadNotes();
      this.exitSelectionMode();
      this.presentToast('notes unarchived');
    } catch (error) {
      console.error('Error unarchiving notes:', error);
      this.presentToast('Error unarchiving notes.');
    }
  }

  async shareSelectedNotes() {
    const textToShare = this.selectedNotes.map(note => `Title: ${note.title}\nContent:\n${note.content}`).join('\n\n');

    try {
      await Share.share({
        title: 'Share Notes',
        text: textToShare,
        dialogTitle: 'Share Notes'
      });
    } catch (error) {
      console.error('Error sharing notes:', error);
    }
    this.exitSelectionMode();
  }

  onCardClick(note: any) {
    if (this.inSelectionMode) {
      this.toggleNoteSelection(note);
    } else {
      this.openNote(note);
    }
  }
}
