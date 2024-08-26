import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { PopoverComponent } from './popover/popover.component';
import { IonicStorageModule } from '@ionic/storage-angular';
import { NotesPage } from './notes/notes.page';
import { MatIconModule } from '@angular/material/icon'; 
import { QuillModule, QuillModules } from 'ngx-quill';
import { NgCalendarModule } from 'ionic2-calendar';


const modules: QuillModules = {
    toolbar: [
      ['bold', 'italic', 'underline'], 
      [{ 'list': 'ordered'}, { 'list': 'bullet' }], 
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      [{ 'color': [] }, { 'background': [] }],  
      [{ 'indent': '-1'}, { 'indent': '+1' }],
      ['code-block'], 
      ['link', 'image', 'formula'],
      ['clean']
    ]
  };

@NgModule({
  declarations: [AppComponent,PopoverComponent,],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    IonicStorageModule.forRoot(),
    MatIconModule,
    QuillModule.forRoot({
      modules,
      placeholder: 'Notes content here...',
    }),
    NgCalendarModule,
  
    ],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent], 
})
export class AppModule {}
