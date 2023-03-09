import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalComponent } from './components/modal/modal.component';
import { QuickAddQuotasComponent } from './components/quick-add-quotas/quick-add-quotas.component';
import { LimeTranslatePipe } from './pipes/lime-translate.pipe';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    QuickAddQuotasComponent,
    ModalComponent,
    LimeTranslatePipe,
  ],
  imports: [
    CommonModule,
    HttpClientModule,
  ],
  exports: [
    QuickAddQuotasComponent
  ]
})
export class QuickAddQuotasModule { }
