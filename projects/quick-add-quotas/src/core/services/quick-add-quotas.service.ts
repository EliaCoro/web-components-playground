import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { QuestionsAndSubquestionsData } from '@lib/questions-and-subquestions-data';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class QuickAddQuotasService {

  translations?: Record<string, string>;
  translsationsChange: Subject<Record<string, string>> = new Subject();

  constructor(
    private readonly http: HttpClient
  ) { }

  getAllQuestionsAndSubquestions(sid: number, token: string) {
    return this.http.get<QuestionsAndSubquestionsData>(`
    /index.php/admin/survey/sa/getAllQuestionsAndSubquestions/surveyid/${sid}?YII_CSRF_TOKEN=${token}
    `)
  }

  setTranslations(translations: Record<string, string> | undefined) {
    this.translations = translations;
    this.translsationsChange.next(this.translations);
  }
}
