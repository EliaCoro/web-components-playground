import { NgModule } from '@angular/core';
import { LpdaDownloadMenuComponent } from './lpda-download-menu.component';
import { CommonModule } from '@angular/common';
import { MenuCardComponent } from './components/menu-card/menu-card.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    LpdaDownloadMenuComponent,
    MenuCardComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
  ],
  exports: [
    LpdaDownloadMenuComponent
  ]
})
export class LpdaDownloadMenuModule { }
