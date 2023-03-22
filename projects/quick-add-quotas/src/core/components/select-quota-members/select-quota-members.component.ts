import { Component, Input, OnInit, SimpleChanges, forwardRef } from '@angular/core';
import { ControlValueAccessor, FormControl, FormGroup, NG_VALUE_ACCESSOR } from '@angular/forms';
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
// import { AnswerOption } from '../answer-options-quotas/answer-options-quotas.component';

// export interface AnswerOption {
//   answers: Answer[];
//   selected: boolean;
//   limit: number;
// }

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
export class SelectQuotaMembersComponent implements OnInit, ControlValueAccessor {

  @AutoDestroy destroy$: Subject<void> = new Subject<void>();

  private readonly notifyChange$ = new Subject<Quota[]>();

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

  @Input() settings: Partial<QuotaSettings> = {};

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

  constructor(
    // private readonly service: QuickAddQuotasService
  ) {
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
    this.generatePartials();
    this.notifyChanges();
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

  ngOnInit(): void {}

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

  private formatOutput(): Quota[]{
    return this.items.filter((item: PartialQuota) => item.selected).map((item: PartialQuota) => {
      const final: Quota & PartialQuota = {
        ...this.defaultSettings,
        ...this.settings,
        ...item,
        name: this.genName(item),
        members: item.answers.map((a: Answer) => ({
          sid: this.settings.sid as number,
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

  private generatePartials(): void {
    const answerOptions: PartialQuota[] = [];

    this.questions.forEach((q: Question, index: number) => {
      if (!(q.answers && Array.isArray(q.answers))) return;

      if (index == 0) {
        q.answers.forEach((a: Answer) => {
          answerOptions.push({
            answers: [a],
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
              answers: [...ao.answers, a],
              selected: true,
              title: this.title(q, a),
              limit: 0
            });
          });
        });

        answerOptions.splice(0, answerOptions.length, ...newAnswerOptions);
      }
    });

    this.items = answerOptions;
    this.notifyChanges();
  }

  private genName(quota: PartialQuota): string {
    return `TODO - ${quota.answers.length}`;
    // return quota.answers.map((a) => a.name).join(' - ');
  }

  private title(q: Question, a: Answer): string {
    return `${q.question} - ${a.answer}`;
  }
}
