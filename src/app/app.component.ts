import { Component, ViewChild } from '@angular/core';
import { IonMenu } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  @ViewChild('mainMenu', { static: true }) mainMenu!: IonMenu;
  currentPage: string = '';

  constructor(private router: Router) {
    this.router.events.subscribe(() => {
      this.currentPage = this.router.url.split('/').pop() as string;
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
