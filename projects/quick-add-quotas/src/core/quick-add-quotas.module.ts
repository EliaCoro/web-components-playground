import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalComponent } from './components/modal/modal.component';
import { QuickAddQuotasComponent } from './components/quick-add-quotas/quick-add-quotas.component';
import { LimeTranslatePipe } from './pipes/lime-translate.pipe';
import { HttpClientModule } from '@angular/common/http';
import { QuestionsSelectorComponent } from './components/questions-selector/questions-selector.component';
import { AnswerOptionsQuotasComponent } from './components/answer-options-quotas/answer-options-quotas.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StyleComponent } from './components/style/style.component';
import { ActionEndSetupComponent } from './components/action-end-setup/action-end-setup.component';

@NgModule({
  declarations: [
    QuickAddQuotasComponent,
    ModalComponent,
    LimeTranslatePipe,
    QuestionsSelectorComponent,
    AnswerOptionsQuotasComponent,
    StyleComponent,
    ActionEndSetupComponent,
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    NgSelectModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  exports: [
    QuickAddQuotasComponent
  ]
})
export class QuickAddQuotasModule { }
