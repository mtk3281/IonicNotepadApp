import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { StatusBar } from '@capacitor/status-bar';
import { IonMenu } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { NotesService } from '../notes.service';

@Component({
  selector: 'app-notes',
  templateUrl: './notes.page.html',
  styleUrls: ['./notes.page.scss'],
})
export class NotesPage implements OnInit {


  notes: any[] = [];
  selectedNotes: any[] = [];
  inSelectionMode = false;

  @ViewChild('mainMenu', { static: true }) mainMenu!: IonMenu;
  currentPage: string = '';

  constructor(private router: Router, private storage: Storage, private notesService: NotesService) {
    this.router.events.subscribe(() => {
      this.currentPage = this.router.url.split('/').pop() as string;
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
    await StatusBar.setBackgroundColor({ color: '#FFFFFF' });
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

  onSearchClick() {
    console.log('onSearchClick');
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

  deleteSelectedNotes() {
    // Implement deletion logic here
    console.log('Delete selected notes:', this.selectedNotes);
    this.exitSelectionMode();
  }

  archiveSelectedNotes() {
    // Implement archiving logic here
    console.log('Archive selected notes:', this.selectedNotes);
    this.exitSelectionMode();
  }

  shareSelectedNotes() {
    // Implement sharing logic here
    console.log('Share selected notes:', this.selectedNotes);
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
