import { Component, AfterViewInit, ViewChild, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { IonMenu } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { NotesService } from '../notes.service';
import { Share } from '@capacitor/share';
import { AlertController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';
import { SearchService } from '../search.service';
import { IonSearchbar} from '@ionic/angular';
import { SettingsService } from '../settings.service';

@Component({
  selector: 'app-notes',
  templateUrl: './notes.page.html',
  styleUrls: ['./notes.page.scss'],
})
export class NotesPage implements OnInit, AfterViewInit{


  notes: any[] = [];
  selectedNotes: any[] = [];
  filteredNotes: any[] = [];   
  inSelectionMode = false;
  inSearchMode = false;
  addNewItemsToBottom = true;

  @ViewChild('searchbar', { static: false, read: IonSearchbar }) searchbar!: IonSearchbar;
  @ViewChild('mainMenu', { static: true }) mainMenu!: IonMenu;


  currentPage: string = '';

  /* constructor which initializes the required services and the router
    it also checks if the notes are being loaded
    if the notes are being loaded, it sets the notes
    it also checks if the search mode is activated
    if the search mode is activated, it sets the inSearchMode to true
    if the search mode is activated, it calls the activateSearchMode() function
    */
  constructor(
    private router: Router,
    private storage: Storage,
    private cdr: ChangeDetectorRef,
    private alertController: AlertController,
    private toastController: ToastController,
    private notesService: NotesService,
    private searchService: SearchService,
    private settingsService: SettingsService
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

  // creating storage and loading notes
  // loading settings
  // loading notes
  async ngOnInit() {
    await this.storage.create();
    await this.loadSettings();  
    await this.loadNotes();
  
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        if (event.urlAfterRedirects === '/notes') {
          this.loadSettings();  
          this.loadNotes();
        }
      }
    });
  }

  async loadSettings() {
    this.addNewItemsToBottom = await this.settingsService.getAddNewItemsToBottom();
  }

  async loadNotes() {
    this.notes = await this.notesService.getNotes(false);
    if (!this.addNewItemsToBottom) {
      this.notes.reverse();
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
      duration: 2000,  // Duration in milliseconds
      position: 'bottom',  // Position on the screen
      color: 'dark',  // Customize the color if needed
      cssClass: 'toast-custom',
    });
    toast.present();
  }
  
  
  // function which detect changes inSearchMode and sets focus
  ngAfterViewInit() {
    this.cdr.detectChanges();
    if (this.inSearchMode) {

      setTimeout(() => {
        console.log('Setting focus');
        this.searchbar.setFocus();
      }, 300);
    }
  }

  // function to activate search mode
  // sets inSearchMode to true
  activateSearchMode() {
    this.inSearchMode = true;
    this.cdr.detectChanges();
    setTimeout(() => {
      console.log('Setting focus in activateSearchMode');
      this.searchbar.setFocus();
    }, 300);
  }

  deactivateSearchMode() {
    this.inSearchMode = false;
  }

  // function to search notes
  // filters notes based on the query
  onSearch(event: any) {
    const query = event.detail.value.toLowerCase();
    this.filteredNotes = query ? this.notes.filter(note => 
      note.title.toLowerCase().includes(query) || 
      note.content.toLowerCase().includes(query)
    ) : [];
  }

  onClearSearch() {
    this.filteredNotes = [];
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
            await this.loadNotes(); 
            this.exitSelectionMode();
            this.presentToast('deleted successfully.');  
          }
        }
      ]
    });
  
    await alert.present();
  }
  
  async archiveSelectedNotes() {
    for (const note of this.selectedNotes) {
      note.isArchived = true;
      await this.notesService.updateNote(note); 
    }
    await this.loadNotes();
    this.exitSelectionMode();
    this.presentToast('note archived');
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
    this.inSearchMode=false;
    if (this.inSelectionMode) {
      this.toggleNoteSelection(note);
    } else {
      this.openNote(note);
    }
  }
  
}
