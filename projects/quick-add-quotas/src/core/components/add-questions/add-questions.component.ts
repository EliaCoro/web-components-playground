import { Component, ElementRef, HostBinding, Input, OnInit, ViewChild, forwardRef } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Question } from '@lib/question';
import { Subject } from 'rxjs';
import { QuickAddQuotasService } from '../../services/quick-add-quotas.service';
import { NgSelectComponent } from '@ng-select/ng-select';

@Component({
  selector: 'lib-add-questions',
  templateUrl: './add-questions.component.html',
  styleUrls: [
    './add-questions.component.scss',
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AddQuestionsComponent),
      multi: true
    }
  ]
})
export class AddQuestionsComponent implements ControlValueAccessor {

  addQuestionControl: FormControl = new FormControl();

  questionsToSelect: Question[] = [];

  selectedQuestions?: Question[] = [];

  allQuestions: Question[] = [];

  @Input() autofocus: boolean = false;

  @ViewChild(NgSelectComponent) ngSelect?: NgSelectComponent;

  private readonly questionChanges$: Subject<Question[]> = new Subject();

  disabled: boolean = false;

  constructor(
    private readonly service: QuickAddQuotasService,
    private readonly componentRef: ElementRef
  ) {
    service.questionsChange$.subscribe((qs: Question[] | undefined) => {
      this.allQuestions = qs || [];
      this.resetSelectedQuestions();
    });

    this.addQuestionControl.valueChanges.subscribe((q: Question | null) => {
      q && this.add(q);
    });
  }

  writeValue(obj: any): void {
    this.selectedQuestions = obj;
  }

  registerOnChange(fn: any): void {
    this.questionChanges$.subscribe(fn);
  }

  registerOnTouched(fn: any): void {
    this.questionChanges$.subscribe(fn);
  }

  setDisabledState?(isDisabled: boolean): void {
    if (isDisabled) {
      this.addQuestionControl.disable();
    } else {
      this.addQuestionControl.enable();
    }

    this.disabled = isDisabled;
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.service.tryLoadInitialData();

    if (this.autofocus) {
      this.focus();
    }
  }

  focus(): void {
    const input: NgSelectComponent | undefined = this.ngSelect;
    if (!input) return;

    input.focus();
    input.open();
  }

  selectOpened(): void {}

  selectClosed(): void {}

  remove(q: Question) {
    this.selectedQuestions = this.selectedQuestions?.filter(qq => qq.qid != q.qid);
    this.resetSelectedQuestions();
    this.notifyChanges();
  }

  private add(q: Question) {
    this.selectedQuestions ||= [];
    this.selectedQuestions.push(q);
    this.addQuestionControl.setValue(null);
    this.resetSelectedQuestions();
    this.notifyChanges();
  }

  private notifyChanges(): void {
    this.questionChanges$.next(this.selectedQuestions);
  }

  private resetSelectedQuestions(): void {
    this.selectedQuestions ||= [];
    this.questionsToSelect ||= [];
    this.allQuestions ||= [];
    this.questionsToSelect = this.filterSelectedQuestions(this.allQuestions);
  }

  private filterSelectedQuestions(questions: Question[]): Question[] {
    if (!(this.selectedQuestions && Array.isArray(this.selectedQuestions))) return questions;

    return questions.filter(q => this.selectedQuestions!.find(qq => qq.qid == q.qid) == undefined);
  }
}
