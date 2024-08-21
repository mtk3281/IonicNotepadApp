import { Component } from '@angular/core';

@Component({
  selector: 'app-create-new-note',
  templateUrl: './create-new-note.page.html',
  styleUrls: ['./create-new-note.page.scss'],
})
export class CreateNewNotePage {
  currentDate: Date;

  constructor() {
    this.currentDate = new Date();
  }
}
