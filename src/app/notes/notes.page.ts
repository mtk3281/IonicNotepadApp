import { Component, AfterViewInit, ViewChild, ElementRef, OnInit} from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { StatusBar } from '@capacitor/status-bar';
import { IonMenu } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { NotesService } from '../notes.service';
import { Share } from '@capacitor/share';
import { AlertController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';
import { SearchService } from '../search.service';

@Component({
  selector: 'app-notes',
  templateUrl: './notes.page.html',
  styleUrls: ['./notes.page.scss'],
})
export class NotesPage implements OnInit {


  notes: any[] = [];
  selectedNotes: any[] = [];
  filteredNotes: any[] = [];   // Notes that match the search query
  inSelectionMode = false;
  inSearchMode = false;


  @ViewChild('mainMenu', { static: true }) mainMenu!: IonMenu;

  @ViewChild('searchBar', { static: false }) searchBar!: ElementRef;


  currentPage: string = '';

  constructor(
    private router: Router,
    private storage: Storage,
    private notesService: NotesService,
    private alertController: AlertController,
    private toastController: ToastController,
    private searchService: SearchService,
  ) {
    this.router.events.subscribe(() => {
      this.currentPage = this.router.url.split('/').pop() as string;
    });

    this.searchService.searchMode$.subscribe(mode => {
      if (mode) {
        this.activateSearchMode();
      } else {
        this.inSearchMode = false;
      }
    });
    
    
  }

  async ngOnInit() {
    await this.storage.create();
    await this.loadNotes();

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        if (event.urlAfterRedirects === '/notes') {
          this.loadNotes(); // Reload notes when returning to the notes page
        }
      }
    });
    await StatusBar.setBackgroundColor({ color: '#ffffff' });
    
  }
  

  async loadNotes() {
    this.notes = await this.notesService.getNotes();
  }

  openNote(note: any) {
    if (this.inSelectionMode) {
      this.toggleNoteSelection(note);
    } else {
      this.router.navigate(['/create-new-note'], {
        state: { note: { id: note.id, title: note.title, content: note.content } }
      });
    }
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


  activateSearchMode() {
    this.inSearchMode = true;
    setTimeout(() => {
      this.searchBar.nativeElement.setFocus();
    }, 300); // Delay to ensure the search bar is fully rendered
  }

  deactivateSearchMode() {
    this.inSearchMode = false;
  }

  onClearSearch() {
    this.filteredNotes = [];  // Clear filtered notes
  }

  onSearch(event: any) {
    const query = event.detail.value.toLowerCase();
    this.filteredNotes = query ? this.notes.filter(note => 
      note.title.toLowerCase().includes(query) || 
      note.content.toLowerCase().includes(query)
    ) : [];
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
            for (const note of this.selectedNotes) {
              await this.notesService.deleteNoteById(note.id);
            }
            await this.loadNotes(); // Reload notes after deletion
            this.exitSelectionMode();
            this.presentToast('Notes deleted successfully.');  // Show toast message
          }
        }
      ]
    });
  
    await alert.present();
  }
  
  

  async archiveSelectedNotes() {
    for (const note of this.selectedNotes) {
      note.isArchived = true; // Or add another property to mark as archived
      await this.notesService.updateNote(note);
    }
    await this.loadNotes();
    this.exitSelectionMode();
    this.presentToast('Note Bookmarked');  // Show toast message

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
