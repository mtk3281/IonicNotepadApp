import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreateNewNotePageRoutingModule } from './create-new-note-routing.module';

import { CreateNewNotePage } from './create-new-note.page';
import { QuillModule,QuillModules } from 'ngx-quill';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CreateNewNotePageRoutingModule,
    QuillModule.forRoot(),
  ],
  declarations: [CreateNewNotePage]
})
export class CreateNewNotePageModule {}
