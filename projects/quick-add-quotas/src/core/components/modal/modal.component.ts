import { Component, EventEmitter, HostBinding, OnInit, Output, ViewChild } from '@angular/core';
import { QuickAddQuotasService } from '../../services/quick-add-quotas.service';
import { Question } from '@lib/question';
import { Subject, Subscription, merge } from 'rxjs';
import { AutoDestroy } from '@lib/auto-destroy';
import { takeUntil } from 'rxjs/operators';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { CustomValidators } from '@lib/custom-validators';
import { QuotaAction } from '@lib/quota-action';
import { QuotaType } from '@lib/quota-type';
import { ActionToPerform } from '@lib/action-to-perform';
import { Quota } from '@lib/quota';
import { Translation } from '@lib/translation';
import { QuotaSettings } from '../select-quota-members/select-quota-members.component';
import { AddQuestionsComponent } from '../add-questions/add-questions.component';

const translationValidator = (control: AbstractControl): ValidationErrors | null => {
  const tr : Translation | undefined = control.value;
  if (!(tr instanceof Object)) return { invalid: true };

  if (!(tr.lang && tr.lang.length > 0)) return { invalid: true, spec: 'lang' };
  if (!(tr.language_name && tr.language_name.length > 0)) return { invalid: true, spec: 'language_name' };

  return null;
};

const quotaValidator = (control: AbstractControl): ValidationErrors | null => {
  const quota: Quota | undefined = control.value;
  if (!(quota instanceof Object)) return { invalid: true };

  if ((quota.limit == undefined || quota.limit == null || typeof quota.limit != "number") && quota.limit != 0) return { invalid: true, spec: 'limit' };

  return null;
};

@Component({
  selector: 'lib-modal',
  templateUrl: './modal.component.html',
  styleUrls: [
    './modal.component.scss',
  ]
})
export class ModalComponent {

  @Output() private readonly close: EventEmitter<void> = new EventEmitter<void>();

  @AutoDestroy private destroy$: Subject<void> = new Subject<void>();

  @ViewChild(AddQuestionsComponent) addQuestionsInput?: AddQuestionsComponent;

  currentIndex: 1|2|3 = 1;

  get isLastStep(): boolean {
    return this.currentIndex == 3;
  }

  get isFirstStep(): boolean {
    return this.currentIndex == 1;
  }

  selectedQuestions: Question[] = [];

  // TODO set this
  quotaSettings: Partial<QuotaSettings> = {};

  readonly form = new FormGroup({
    questions: new FormControl([], [
      CustomValidators.required,
      CustomValidators.arrayMinLength(1)
    ]),

    quotas: new FormControl([], [
      CustomValidators.required,
      CustomValidators.arrayMinLength(1),
      CustomValidators.validateArray(quotaValidator)
    ]),

    quotaAction: new FormControl(QuotaAction.Terminate, [
      CustomValidators.required,
      CustomValidators.inclusion([QuotaAction.AllowChange, QuotaAction.Terminate])
    ]),

    quotaType: new FormControl(QuotaType.Quota, [
      CustomValidators.required,
      CustomValidators.inclusion([QuotaType.Cheater, QuotaType.Quota, QuotaType.Screenout])
    ]),

    // actionToPerform: new FormControl(ActionToPerform.Redirect, [
    //   CustomValidators.required,
    //   CustomValidators.inclusion([ActionToPerform.MessageAndRedirect, ActionToPerform.Redirect, ActionToPerform.Message])
    // ]),

    // TODO validate translations based on actionToPerform
    translations: new FormControl([], [
      CustomValidators.required,
      CustomValidators.arrayMinLength(1),
      CustomValidators.validateArray(translationValidator)
    ])
  })

  ngOnInit(): void {
    this.form.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.selectedQuestions = this.form.get('questions')?.value;
    });
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.addQuestionsInput?.focus(), 50)
  }

  private submit(): void {
    console.log("submitted", this);
  }

  increaseIndex(): void {
    if (this.isLastStep) return this.submit();

    this.currentIndex++;

    this.fixIndexIfInvalid();
  }

  decreaseIndex(): void {
    if (this.isFirstStep) return this.cancel();

    this.currentIndex--;

    this.fixIndexIfInvalid();
  }

  cancel(): void {
    if (this.form.touched && !confirm("Are you sure you want to cancel?")) return;
    this.closeModal();
  }

  private closeModal(): void {
    this.close.emit();
  }

  private fixIndexIfInvalid(): void {
    if (!(this.currentIndex && this.currentIndex > 0)) this.currentIndex = 1;
    else if (this.currentIndex > 2) this.currentIndex = 3;
  }
}
