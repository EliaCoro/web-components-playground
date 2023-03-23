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

  includeQuotaType: boolean = INCLUDE_QUOTA_TYPE;

  @Output() onSubmit$: EventEmitter<FinalFormattedData[]> = new EventEmitter<FinalFormattedData[]>();

  @Output() private readonly close: EventEmitter<void> = new EventEmitter<void>();

  @AutoDestroy private destroy$: Subject<void> = new Subject<void>();

  @ViewChild(AddQuestionsComponent) addQuestionsInput?: AddQuestionsComponent;

  currentIndex: 1 | 2 | 3 = 1;

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

    quotas: new FormControl([], [
      CustomValidators.required,
      CustomValidators.arrayMinLength(1),
      CustomValidators.validateArray(quotaValidator)
    ]),

    quotaAction: new FormControl(QuotaAction.Terminate, [
      CustomValidators.required,
      CustomValidators.inclusion(QuotaActions)
    ]),

    ...(INCLUDE_QUOTA_TYPE ?
      {
        quotaType: new FormControl(QuotaType.Quota, [
          CustomValidators.required,
          CustomValidators.inclusion(QuotaTypes)
        ]),
      } : {}),

    // ...{
    //   quotaType: new FormControl(QuotaType.Quota, [
    //     CustomValidators.required,
    //     CustomValidators.inclusion(QuotaTypes)
    //   ]),
    // },

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
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.addQuestionsInput?.focus(), 50)
  }

  private submit(): void {
    this.onSubmit$.emit(this.parseData());
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
