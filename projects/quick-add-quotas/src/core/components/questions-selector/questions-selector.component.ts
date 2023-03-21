import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Question } from '@lib/question';
import { QuickAddQuotasService } from '../../services/quick-add-quotas.service';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'lib-questions-selector',
  templateUrl: './questions-selector.component.html',
  styleUrls: [
    './questions-selector.component.scss',
  ]
})
export class QuestionsSelectorComponent implements OnInit {

  questions?: Question[];

  /**
   * Questions still available to select
   */
  questionsToSelect: Question[] = [];

  selectedQuestions?: Question[] = [];

  readonly addQuestionControl = new FormControl(null);

  constructor(
    private readonly service: QuickAddQuotasService
  ) { }

  ngOnInit(): void {
    this.addQuestionControl.valueChanges.subscribe((q) => {
      if (q) this.add(q);
    });

    this.service.questionsChange.subscribe((questions) => {
      questions ||= [];

      this.questions = questions;
      const selectedIds = this.selectedQuestions?.map(q => q.qid) || [];

      this.questionsToSelect = this.questions.filter(q => {
        return !selectedIds.includes(q.qid);
      });
    });
  }

  remove(q: Question) {
    this.selectedQuestions = this.selectedQuestions?.filter(qq => qq.qid != q.qid);
    this.service.setSelectedQuestions(this.selectedQuestions);
    this.questionsToSelect.push(q);
  }

  private add(q: Question) {
    this.selectedQuestions = this.selectedQuestions || [];
    this.selectedQuestions.push(q);
    this.questionsToSelect = this.questionsToSelect.filter(qq => qq.qid != q.qid);
    this.service.setSelectedQuestions(this.selectedQuestions);
    this.addQuestionControl.setValue(null);
  }
}
