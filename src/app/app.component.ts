import { Component, ViewChild } from '@angular/core';
import { IonMenu } from '@ionic/angular';
import { Router } from '@angular/router';
import { IonSearchbar, MenuController } from '@ionic/angular';
import { SearchService } from './search.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  @ViewChild('mainMenu', { static: true }) mainMenu!: IonMenu;
  @ViewChild('menuSearchBar', { static: false }) menuSearchBar!: IonSearchbar;

  currentPage: string = '';

  constructor(
    private menu: MenuController,
    private router: Router,
    private searchService: SearchService
  ) {
    this.router.events.subscribe(() => {
      this.currentPage = this.router.url.split('/').pop() as string;
    });
  }

  onSearchMenu() {
    this.mainMenu.close(); // Close the menu
    this.router.navigate(['/notes']).then(() => {
      // Trigger the search mode activation after navigation
      this.searchService.setSearchMode(true);
    });
  }


  isActivePage(page: string): boolean {
    return this.currentPage === page;
  }

  navigateTo(page: string) {
    this.router.navigate([page]);
  }

  closeMenu() {
    this.mainMenu.close();
  }
}
