import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CreateNewNotePage } from './create-new-note.page';

const routes: Routes = [
  {
    path: '',
    component: CreateNewNotePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreateNewNotePageRoutingModule {}
