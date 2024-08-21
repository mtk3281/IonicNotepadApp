import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StatusBar } from '@capacitor/status-bar';
@Component({
  selector: 'app-notes',
  templateUrl: './notes.page.html',
  styleUrls: ['./notes.page.scss'],
})
export class NotesPage implements OnInit {

  constructor() {

  }


  goToNewPage() {
    console.log('goToNewPage');
  }

  onSearchClick(){
    console.log('onSearchClick');
  }

  async ngOnInit() {
    await StatusBar.setBackgroundColor({ color: '#FFFFFF' }); // Set background color to white
  }

}
