import { Component, AfterViewInit, ViewChild, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { StatusBar } from '@capacitor/status-bar';
import { IonMenu } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { NotesService } from '../notes.service';
import { AlertController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.page.html',
  styleUrls: ['./calendar.page.scss'],
})
export class CalendarPage implements OnInit, AfterViewInit {

  selectedDate: string = new Date().toISOString();

  notes: any[] = [];
  
  filteredNotes: any[] = [];
  inSelectionMode = false;
  
  @ViewChild('mainMenu', { static: true }) mainMenu!: IonMenu;

  constructor(
    private router: Router,
    private storage: Storage,
    private notesService: NotesService,
    private alertController: AlertController,
    private toastController: ToastController,
    private cdr: ChangeDetectorRef
  ) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.loadNotesForDate(this.selectedDate);
      }
    });
  }

  async ngOnInit() {
    await this.storage.create();
    await this.loadNotesForDate(this.selectedDate);
    await StatusBar.setBackgroundColor({ color: '#ffffff' });
  }

  ngAfterViewInit() {
    this.cdr.detectChanges();
  }

  async loadNotesForDate(date: string) {
    this.notes = await this.notesService.getNoteById(date);  // Assumes a method to fetch notes by date
  }

  onDateSelected(event: any) {
    this.selectedDate = event.detail.value;
    this.loadNotesForDate(this.selectedDate);
  }

  openNote(note: any) {
    if (this.inSelectionMode) {
      this.toggleNoteSelection(note);
    } else {
      this.router.navigate(['/create-new-note'], {
        state: { note: { id: note.id, title: note.title, content: note.content, date: this.selectedDate } }
      });
    }
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: 'bottom',
      color: 'dark',
    });
    toast.present();
  }

  enterSelectionMode() {
    this.inSelectionMode = true;
  }

  exitSelectionMode() {
    this.inSelectionMode = false;
    this.filteredNotes = [];
  }

  toggleNoteSelection(note: any) {
    const index = this.filteredNotes.indexOf(note);
    if (index > -1) {
      this.filteredNotes.splice(index, 1);
    } else {
      this.filteredNotes.push(note);
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
            for (const note of this.filteredNotes) {
              await this.notesService.deleteNoteById(note.id);
            }
            await this.loadNotesForDate(this.selectedDate);
            this.exitSelectionMode();
            this.presentToast('Deleted successfully.');
          }
        }
      ]
    });

    await alert.present();
  }

  onCardClick(note: any) {
    if (this.inSelectionMode) {
      this.toggleNoteSelection(note);
    } else {
      this.openNote(note);
    }
  }

  async createNote() {
    this.router.navigate(['/create-new-note'], {
      state: { date: this.selectedDate }
    });
  }
}
