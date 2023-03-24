import { Component, Input, OnInit, SimpleChanges, forwardRef } from '@angular/core';
import { AbstractControl, ControlValueAccessor, FormControl, FormGroup, NG_VALUE_ACCESSOR, ValidationErrors } from '@angular/forms';
import { AutoDestroy } from '@lib/auto-destroy';
import { Subject } from 'rxjs';
import { QuickAddQuotasService } from '../../services/quick-add-quotas.service';
import { takeUntil } from 'rxjs/operators';
import { Answer } from '@lib/answer';
import { Question } from '@lib/question';
import { Quota } from '@lib/quota';
import { QuotaAction } from '@lib/quota-action';
import { QuotaMember } from '@lib/quota-member';
import { QuotaType } from '@lib/quota-type';
import { CustomValidators } from '@lib/custom-validators';

// Loadash must be loaded in the app
var _: any;

export interface ExportQuota {
  members: QuotaMember[];
  limit: number;
  selected: boolean;
  title: string;
  name: string;
}

export interface PartialQuota {
  answers: Answer[];
  limit: number;
  selected: boolean;
  title: string;
};

export interface QuotaSettings {
  sid: number;
  autoloadUrl: boolean;
  active: boolean;
  action: QuotaAction;
  quotaType: QuotaType;
}

@Component({
  selector: 'lib-select-quota-members',
  templateUrl: './select-quota-members.component.html',
  styleUrls: [
    './select-quota-members.component.scss',
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectQuotaMembersComponent),
      multi: true
    }
  ]
})
export class SelectQuotaMembersComponent implements ControlValueAccessor {

  @AutoDestroy destroy$: Subject<void> = new Subject<void>();

  private readonly notifyChange$ = new Subject<ExportQuota[]>();

  private readonly defaultQuotaName: string = `QQuota
    [
      <% _.forEach(answers, function(answer) { %>
        <%- answer.code %> - (<%- answer.answer %>)
      <% }); %>
    ]
  `;

  readonly quotaName: FormControl = new FormControl(this.defaultQuotaName, [
    CustomValidators.required,
    CustomValidators.minLength(5)
  ]);

  // TODO notify this on input touch
  readonly touched$: Subject<void> = new Subject<void>();

  _disabled: boolean = false;
  @Input() set disabled(value: boolean) {
    this.setDisabledState(value);
  }

  get disabled(): boolean {
    return this._disabled;
  }

  @Input() questions: Question[] = [];

  private readonly defaultSettings: QuotaSettings = {
    sid: 0,
    autoloadUrl: false,
    active: true,
    action: QuotaAction.Terminate,
    quotaType: QuotaType.Quota,
  };

  readonly form = new FormGroup({
    limit: new FormControl(null),
    selected: new FormControl(false),
  });

  selectedCount?: number;
  totalCount?: number;

  items: PartialQuota[] = [];

  constructor() {
    this.quotaName.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((value) => {
      this.notifyChanges();
    });

    this.notifyChange$.pipe(takeUntil(this.destroy$)).subscribe((quotas) => {
      this.touched$.next();

      this.selectedCount = this.items.filter((q) => q.selected).length;
      this.totalCount = this.items.length;
      this.form.controls['selected'].setValue(this.selectedCount === this.totalCount, { emitEvent: false });
    });

    this.form.controls['selected'].valueChanges.pipe(takeUntil(this.destroy$)).subscribe((value) => {
      this.items.forEach((i) => i.selected = value);
      this.notifyChanges();
    });

    this.form.controls['limit'].valueChanges.pipe(takeUntil(this.destroy$)).subscribe((value) => {
      this.items.forEach((i) => i.limit = value);
      this.notifyChanges();
    });
  }

  writeValue(obj: Quota[]): void {
    this.generatePartials(obj);
  }

  registerOnChange(fn: any): void {
    this.notifyChange$.subscribe(fn);
  }

  registerOnTouched(fn: any): void {
    this.touched$.subscribe(fn);
  }

  setDisabledState(isDisabled: boolean): void {
    this._disabled = isDisabled;
    this.form[isDisabled ? 'disable' : 'enable']();
  }

  ngAfterViewInit(): void {
    // Make sure parent component has data even if user doesn't change anything
    this.notifyChanges();
  }

  selectedChange(selected: boolean, index: number): void {
    this.items[index].selected = selected;
    this.notifyChanges();
  }

  limitChange(limit: number, index: number): void {
    this.items[index].limit = limit;
    this.notifyChanges();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['questions']) {
      this.generatePartials();
    }

    if (changes['settings']) {
      this.notifyChanges();
    }
  }

  private notifyChanges(): void {
    this.notifyChange$.next(this.formatOutput());
  }

  private formatOutput(): ExportQuota[] {
    const settings = this.defaultSettings;

    return this.items.filter((item: PartialQuota) => item.selected).map((item: PartialQuota) => {
      const final: ExportQuota = {
        ...item,
        name: this.genName(item),
        members: item.answers.map((a: Answer) => ({
          sid: settings.sid as number,
          qid: a.qid as number,
          code: a.code as string,
        })),
      };

      delete (final as any)['selected'];
      delete (final as any)['answers'];
      delete (final as any)['title'];

      return final;
    });
  }

  private generatePartials(savedQuotas: Quota[] = []): void {
    const answerOptions: PartialQuota[] = [];

    this.questions.forEach((q: Question, index: number) => {
      if (!(q.answers && Array.isArray(q.answers))) return;

      if (index == 0) {
        q.answers.forEach((a: Answer) => {
          answerOptions.push({
            answers: [{ ...a, question: q.question }],
            selected: true,
            title: this.title(q, a),
            limit: 0,
          });
        });
      } else {
        const newAnswerOptions: PartialQuota[] = [];
        answerOptions.forEach((ao: PartialQuota) => {
          q.answers!.forEach((a: Answer) => {
            newAnswerOptions.push({
              answers: [
                ...ao.answers, { ...a, question: q.question }
              ],
              selected: true,
              title: this.title(q, a),
              limit: 0
            });
          });
        });

        answerOptions.splice(0, answerOptions.length, ...newAnswerOptions);
      }
    });

    this.items = savedQuotas && savedQuotas.length > 0 ? this.setQuotaLimitsBySaved(savedQuotas, answerOptions) : answerOptions;
    this.notifyChanges();
  }

  private genName(quota: PartialQuota): string {
    return this.genNameWithLoadash(quota) || this.genNameWithTemplate(quota);
  }

  readonly removeNewLines = (str: string) => str.replace(/(\r\n|\n|\r)/gm, '');

  readonly removeDoubleSpaces = (str: string) => str.replace(/\s{2,}/g, ' ');

  readonly parseTemplate = (str: string) => this.removeDoubleSpaces(this.removeNewLines(str)).trim();

  private genNameWithLoadash(quota: PartialQuota): string | null {
    if (!_ && (window as any)['_']) var _ = (window as any)['_'];

    // Check if _ is defined, otherwise throw error
    if (!_) {
      console.error('lodash is not defined. Please include lodash in your project.');
      return null;
    }

    const string: string = this.parseTemplate(this.quotaName.valid && this.quotaName.value ? this.quotaName.value : this.defaultQuotaName);

    return _.template(string)(quota);
  }

  private genNameWithTemplate(quota: PartialQuota): string {
    return quota.answers.map((a: Answer) => `${a.code} - ${a.answer}`).join(' | ');
  }

  private title(q: Question, a: Answer): string {
    return `${q.question} - ${a.answer}`;
  }

  /**
   * 
   * @param quotas Quotas to compare against
   * @param items PartialQuotas to compare
   * @returns PartialQuotas with selected and limit set
   */
  private setQuotaLimitsBySaved(quotas: Quota[], items: PartialQuota[]): PartialQuota[] {
    return items.map((i: PartialQuota) => {
      const match = quotas.find((q: Quota) => this.areEqual(q, i));

      i.selected = match ? true : false;

      if (match) {
        i.limit = match.limit;
      }

      return i;
    });
  }

  /**
   * 
   * @param a Quota to compare
   * @param b PartialQuota to compare
   * @returns Boolean indicating if the two quotas have the same members/answers
   */
  private areEqual(a: Quota, b: PartialQuota): boolean {
    const aMembers = a.members.sort((a, b) => a.qid - b.qid);
    const bMembers = b.answers.sort((a, b) => a.qid - b.qid);

    const membersEqual = aMembers.length === bMembers.length && aMembers.every((m, i) => this.areMembersEqual(m, bMembers[i]));

    return a.members.length === b.answers.length && membersEqual;
  }

  private areMembersEqual(a: QuotaMember, b: Answer): boolean {
    return a.qid === b.qid && a.code === b.code;
  }
}
