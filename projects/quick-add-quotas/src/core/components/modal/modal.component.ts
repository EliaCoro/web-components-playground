import { Component, EventEmitter, HostBinding, OnInit, Output, ViewChild } from '@angular/core';
import { QuickAddQuotasService } from '../../services/quick-add-quotas.service';
import { Question } from '@lib/question';
import { Subject, Subscription, merge } from 'rxjs';
import { AutoDestroy } from '@lib/auto-destroy';
import { takeUntil } from 'rxjs/operators';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { CustomValidators } from '@lib/custom-validators';
import { QuotaAction, QuotaActions, defaultQuotaAction } from '@lib/quota-action';
import { QuotaType, QuotaTypes, defaultQuotaType } from '@lib/quota-type';
import { ActionToPerform, ActionsToPerform } from '@lib/action-to-perform';
import { Quota } from '@lib/quota';
import { Translation } from '@lib/translation';
import { QuotaSettings } from '../select-quota-members/select-quota-members.component';
import { AddQuestionsComponent } from '../add-questions/add-questions.component';
import { FinalFormattedData } from '@lib/final-formatted-data';
import { INCLUDE_QUOTA_TYPE } from '@lib/include-quota-type';

const translationValidator = (control: AbstractControl): ValidationErrors | null => {
  const tr: Translation | undefined = control.value;
  if (!(tr instanceof Object)) return { invalid: true };

  if (!(tr.lang && tr.lang.length > 0)) return { invalid: true, spec: 'lang' };
  if (!(tr.language_name && tr.language_name.length > 0)) return { invalid: true, spec: 'language_name' };

  return null;
};

const quotaValidator = (control: AbstractControl): ValidationErrors | null => {
  const quota: Quota | undefined = control.value;
  if (!(quota instanceof Object)) return { invalid: true };

  const limit: number | undefined | string | null = quota.limit;

  if (!(limit != undefined && limit != null && typeof limit == 'number' && limit > -1)) return { invalid2: { field: 'limit' } };

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

  includeQuotaType: boolean = INCLUDE_QUOTA_TYPE;

  @Output() onSubmit$: EventEmitter<FinalFormattedData[]> = new EventEmitter<FinalFormattedData[]>();

  @Output() private readonly close: EventEmitter<void> = new EventEmitter<void>();

  @AutoDestroy private destroy$: Subject<void> = new Subject<void>();

  @ViewChild(AddQuestionsComponent) addQuestionsInput?: AddQuestionsComponent;

  currentIndex: 1 | 2 | 3 = 1;

  canSubmit: boolean = false;

  get isLastStep(): boolean {
    return this.currentIndex == 3;
  }

  get isFirstStep(): boolean {
    return this.currentIndex == 1;
  }

  selectedQuestions: Question[] = [];

  readonly form: FormGroup = new FormGroup({
    questions: new FormControl([], [
      CustomValidators.required,
      CustomValidators.arrayMinLength(1)
    ]),

    quotaAction: new FormControl(QuotaAction.Terminate, [
      CustomValidators.required,
      CustomValidators.inclusion(QuotaActions)
    ]),

    quotas: new FormControl([], [
      CustomValidators.required,
      CustomValidators.arrayMinLength(1),
      CustomValidators.validateArray(quotaValidator)
    ]),

    ...(INCLUDE_QUOTA_TYPE ?
      {
        quotaType: new FormControl(QuotaType.Quota, [
          CustomValidators.required,
          CustomValidators.inclusion(QuotaTypes)
        ]),
      } : {}),

    actionToPerform: new FormControl(ActionToPerform.Redirect, [
      CustomValidators.required,
      CustomValidators.inclusion(ActionsToPerform)
    ]),

    // TODO validate translations based on actionToPerform
    translations: new FormControl([], [
      CustomValidators.required,
      CustomValidators.arrayMinLength(1),
      CustomValidators.validateArray(translationValidator)
    ])
  })

  constructor() { }

  ngOnInit(): void {
    this.form.get('questions')?.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.selectedQuestions = this.form.get('questions')?.value;
    });

    this.form.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.updateCanSubmit();
    });
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.addQuestionsInput?.focus(), 50)
  }

  private submit(): void {
    this.onSubmit$.emit(this.parseData());
  }

  updateCanSubmit(): void {
    this.canSubmit = this.calcCanSubmit();
  }

  private calcCanSubmit(): boolean {
    const questions: FormControl = this.form.get('questions') as FormControl;
    const quotas: FormControl = this.form.get('quotas') as FormControl;
    const quotaAction: FormControl = this.form.get('quotaAction') as FormControl;
    const translations: FormControl = this.form.get('translations') as FormControl;
    const actionToPerform: FormControl = this.form.get('actionToPerform') as FormControl;

    switch (this.currentIndex) {
      case 1:
        return questions.valid && quotaAction.valid;
      case 2:
        return quotas.valid;
      case 3:
        return translations.valid && actionToPerform.valid;
      default:
        return false;
    }
  }

  increaseIndex(): void {
    if (!(this.canSubmit)) return;

    if (this.isLastStep) return this.submit();

    this.currentIndex++;

    this.fixIndexIfInvalid();

    this.updateCanSubmit();
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

  private parseData(): FinalFormattedData[] {
    const final: FinalFormattedData[] = [];

    const formVal = this.form.value;

    const language_settings = (formVal.translations ?? []).map((message: Translation) => ({
      quotals_language: message.lang,
      quotals_message: message.message,
      quotals_name: message.message,
      quotals_url: message.url,
      quotals_urldescrip: message.urlDescription,
    }));

    const quotaAction: QuotaAction = formVal.quotaAction ?? defaultQuotaAction;
    const autoloadUrl: boolean = formVal.actionToPerform === ActionToPerform.Redirect;
    const quotaType: QuotaType = formVal.quotaType ?? defaultQuotaType;
    const sid: number = 0;

    const add = (data: {
      name: string;
      qlimit: number,
      quota_members: {
        code: string,
        qid: number,
      }[],
    }) => {
      final.push({
        language_settings: language_settings,
        quota: {
          ...(INCLUDE_QUOTA_TYPE ? { quota_type: quotaType } : {}),
          // quota_type: quotaType,
          active: 1,
          action: quotaAction,
          autoload_url: autoloadUrl ? 1 : 0,
          name: data.name,
          qlimit: data.qlimit ?? 0,
          sid: sid,
        },
        quota_members: data.quota_members.map((member) => ({
          ...member,
          sid: sid,
        })),
      });
    };

    formVal.quotas.forEach((quota: Quota) => {
      add({
        name: quota.name,
        qlimit: quota.limit,
        quota_members: quota.members.map((member) => ({
          code: member.code,
          qid: member.qid,
        }))
      })
    });

    return final;
  }
}
