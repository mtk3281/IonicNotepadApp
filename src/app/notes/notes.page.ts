import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { StatusBar } from '@capacitor/status-bar';
import { IonMenu } from '@ionic/angular';


@Component({
  selector: 'app-notes',
  templateUrl: './notes.page.html',
  styleUrls: ['./notes.page.scss'],
})
export class NotesPage implements OnInit {

  @ViewChild('mainMenu', { static: true }) mainMenu!: IonMenu;
  currentPage: string = '';
  
  constructor(private router: Router) {
    this.router.events.subscribe(() => {
      this.currentPage = this.router.url.split('/').pop() as string;
    });
  }

  async ngOnInit() {
    await StatusBar.setBackgroundColor({ color: '#FFFFFF' }); // Set background color to white
  }
  
  onSearchClick(){
    console.log('onSearchClick');
  }


//  isActivePage(page: string): boolean {
//     return this.currentPage === page;
//   }

  navigateTo(page: string) {
    this.router.navigate([page]);
  }

  // closeMenu() {
  //   this.mainMenu.close();
  // }


}
