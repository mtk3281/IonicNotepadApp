import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage{

  selectedDate: string = '';

  constructor() { }

  onDateSelected(event: any) {
    console.log('Selected date:', event.detail.value);
  }


}
