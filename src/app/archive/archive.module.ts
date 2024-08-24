import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ArchivePageRoutingModule } from './archive-routing.module';
import { MatIconModule } from '@angular/material/icon';
import { ArchivePage } from './archive.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ArchivePageRoutingModule,
    MatIconModule
  ],
  declarations: [ArchivePage]
})
export class ArchivePageModule {}
