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
  private colors = [
    '#f1fff2','#fedef3','#fef1de', '#e3f2fd','#fff9c4','#f8bbd0','#d1c4e9'];
  
  private usedColors: string[] = [];

  notes: any[] = [];

  @ViewChild('mainMenu', { static: true }) mainMenu!: IonMenu;
  currentPage: string = '';
  
  constructor(private router: Router, private storage: Storage,private notesService: NotesService,) {

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

  getRandomColor(): string {
    if (this.usedColors.length === this.colors.length) {
      this.usedColors = [];
    }
    const remainingColors = this.colors.filter(color => !this.usedColors.includes(color));

    const randomIndex = Math.floor(Math.random() * remainingColors.length);
    const color = remainingColors[randomIndex];

    this.usedColors.push(color);

    return color;
  }
  
  onSearchClick(){
    console.log('onSearchClick');
  }

  navigateTo(page: string) {
    this.router.navigate([page]);
  }

}
