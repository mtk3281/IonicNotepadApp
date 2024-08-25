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
        const formattedDate = this.formatDateForNotes(this.selectedDate);
        this.loadNotesForDate(formattedDate);
      }
    });
  }

  async ngOnInit() {
    const today = new Date();
    this.selectedDate = today.toISOString(); // Store in ISO format for the calendar
  
    const formattedDate = this.formatDateForNotes(this.selectedDate); // Format to dd/MM/yyyy
    await this.storage.create();
    await this.loadNotesForDate(formattedDate); // Load notes for today's date
    await StatusBar.setBackgroundColor({ color: '#ffffff' });
  }
  
  ngAfterViewInit() {
    this.cdr.detectChanges();
  }

  formatDateForNotes(isoDate: string): string {
    const date = new Date(isoDate);
    return date.toLocaleDateString('en-GB'); // Convert to dd/MM/yyyy format
  }

  async loadNotesForDate(date: string) {
    console.log('Loading notes for date:', date); // Ensure this is always in dd/MM/yyyy format
    this.notes = await this.notesService.getNoteByDate(date);
    console.log('Fetched notes:', this.notes);
  }  

  onDateSelected(event: any) {
    const date = new Date(event.detail.value);
    this.selectedDate = date.toISOString(); // Store in ISO format for the calendar
  
    const formattedDate = this.formatDateForNotes(this.selectedDate); // Convert to dd/MM/yyyy format
    this.loadNotesForDate(formattedDate); // Load notes for the selected date
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
            date: note.date // Pass the saved date
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
            const formattedDate = this.formatDateForNotes(this.selectedDate); // Reformat date before reloading notes
            await this.loadNotesForDate(formattedDate);
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
    console.log('Selected Date:', this.selectedDate);
  
    // Store the previous route
    this.router.navigate(['/create-new-note'], {
      state: { date: this.selectedDate}
    });
  }
  
  
  
}
