import { NgModule } from '@angular/core';
import { LpdaDownloadMenuComponent } from './lpda-download-menu.component';
import { CommonModule } from '@angular/common';
import { MenuCardComponent } from './components/menu-card/menu-card.component';



@NgModule({
  declarations: [
    LpdaDownloadMenuComponent,
    MenuCardComponent
  ],
  imports: [
    CommonModule,
  ],
  exports: [
    LpdaDownloadMenuComponent
  ]
})
export class LpdaDownloadMenuModule { }
