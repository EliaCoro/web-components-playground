// import { Component, HostBinding, OnInit } from '@angular/core';
// import { QuickAddQuotasService } from '../../services/quick-add-quotas.service';
// import { Question } from '@lib/question';
// import { Answer } from '@lib/answer';
// import { Subject } from 'rxjs';
// import { AutoDestroy } from '@lib/auto-destroy';
// import { takeUntil } from 'rxjs/operators';

// export interface AnswerOption {
//   answers: Answer[];
//   selected: boolean;
//   limit: number;
// }

// @Component({
//   selector: 'lib-answer-options-quotas',
//   templateUrl: './answer-options-quotas.component.html',
//   styleUrls: ['./answer-options-quotas.component.scss']
// })
// export class AnswerOptionsQuotasComponent implements OnInit {

//   _answerOptions?: AnswerOption[];
//   get answerOptions(): AnswerOption[] | undefined {
//     return this._answerOptions;
//   }

//   private readonly answerOptionsChange$: Subject<AnswerOption[]> = new Subject<AnswerOption[]>();

//   @AutoDestroy destroy$: Subject<void> = new Subject<void>();

//   @HostBinding('class.hidden') private hidden: boolean = true;

//   allSelected: boolean = true;
//   allLimit: number = 0;
//   selectedCount: number = 0;
//   totalCount: number = 0;

//   constructor(
//     private readonly service: QuickAddQuotasService
//   ) {
//     this.answerOptionsChange$.pipe(takeUntil(this.destroy$)).subscribe((options) => {
//       options ||= [];
//       this.selectedCount = options.filter((o) => o.selected).length;
//       this.totalCount = options.length;
//       this.allSelected = this.selectedCount == this.totalCount;
//     });
//   }

//   ngOnInit(): void {
//     this.questionsChange([]);
//     this.service.selectedQuestionsChange.subscribe((questions) => {
//       this.questionsChange(questions || []);
//     });
//   }

//   updateAllSelected(selected: boolean) {
//     this.allSelected = selected;
//     this.updateAnswerOptions((this.answerOptions || []).map((ao) => ({
//       ...ao,
//       selected
//     })));
//   }

//   selectedChange(selected: boolean, index: number) {
//     this.answerOptionsChange$.next(this.answerOptions);
//   }

//   private updateAllLimitTimeout: any;
//   updateAllLimit(limit: number) {
//     if (this.updateAllLimitTimeout) clearTimeout(this.updateAllLimitTimeout);

//     this.updateAllLimitTimeout = setTimeout(() => {
//       this.allLimit = limit;
//       this.updateAnswerOptions((this.answerOptions || []).map((ao) => ({
//         ...ao,
//         limit: ao.selected ? limit : (ao.limit || 0),
//       })));
//     }, 500);
//   }

//   private questionsChange(questions: Question[]) {
//     this.updateAnswerOptions(this.calcAnswerOptions(questions));
//     this.hidden = !this.answerOptions?.length;
//   }

//   private calcAnswerOptions(questions: Question[]): AnswerOption[] {
//     const answerOptions: AnswerOption[] = [];

//     questions.forEach((q: Question, index: number) => {
//       if (!(q.answers && Array.isArray(q.answers))) return;

//       if (index == 0) {
//         q.answers.forEach((a: Answer) => {
//           answerOptions.push({
//             answers: [a],
//             selected: true,
//             limit: 0,
//           });
//         });
//       } else {
//         const newAnswerOptions: AnswerOption[] = [];
//         answerOptions.forEach((ao: AnswerOption) => {
//           q.answers!.forEach((a: Answer) => {
//             newAnswerOptions.push({
//               answers: [...ao.answers, a],
//               selected: true,
//               limit: 0
//             });
//           });
//         });

//         answerOptions.splice(0, answerOptions.length, ...newAnswerOptions);
//       }
//     });

//     return answerOptions;
//   }

//   private updateAnswerOptions(options: AnswerOption[]) {
//     this._answerOptions = options;
//     this.answerOptionsChange$.next(this.answerOptions || []);
//   }
// }
