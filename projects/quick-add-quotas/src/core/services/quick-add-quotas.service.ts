import { HttpClient } from '@angular/common/http';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Injectable } from '@angular/core';
import { ActionToPerform } from '@lib/action-to-perform';
import { Answer } from '@lib/answer';
import { QaqSettings } from '@lib/qaq-settings';
import { Question } from '@lib/question';
import { QuestionsAndSubquestionsData } from '@lib/questions-and-subquestions-data';
import { QuotaAction } from '@lib/quota-action';
import { QuotaType } from '@lib/quota-type';
import { Observable, Subject, Subscription, merge, of } from 'rxjs';
import { catchError, concatAll, map, tap } from 'rxjs/operators';

const SUPPORTED_QUESTION_TYPES: string[] = ["L"];

@Injectable({
  providedIn: 'root'
})
export class QuickAddQuotasService {

  /**
   * Settings set by the user
   */
  settings?: QaqSettings;
  readonly settingsChange$: Subject<QaqSettings | undefined> = new Subject();

  /**
   * Data fetched from the server
   */
  data: QuestionsAndSubquestionsData | undefined;
  readonly dataChange$: Subject<QuestionsAndSubquestionsData | undefined> = new Subject();

  questions?: Question[];
  readonly questionsChange$: Observable<Question[] | undefined> = this.dataChange$.pipe(
    map(data => this.getValidQuestions(data?.questions || [])),
    tap(questions => this.questions = questions)
  );

  constructor(
    private readonly http: HttpClient
  ) {

    // this.settingsChange$.subscribe(settings => {
    //   if (!settings || this.data) return;

    //   this.tryLoadInitialData(settings.surveyid, settings.yiicsrftoken);
    // });
  }

  
  loadInitialData(sid: number | undefined = this.settings?.surveyid , token: string | undefined = this.settings?.yiicsrftoken): Observable<QuestionsAndSubquestionsData> {
    if (!(sid && token)) throw new Error(`sid and token must be defined. sid: ${sid}, token: ${token}`);

    const urlTemplate = '/index.php/surveyAdministration/quickAddQuotasInfo/surveyid/{{sid}}?YII_CSRF_TOKEN={{token}}';

    const url = urlTemplate.replace("{{sid}}", sid.toString()).replace("{{token}}", token);

    return this.http.get<QuestionsAndSubquestionsData>(url).pipe(
      tap(data => this.setData(data))
    );
  }

  private tryLoadInitialDataTimeout: any;
  tryLoadInitialData(sid: number | undefined = this.settings?.surveyid , token: string | undefined = this.settings?.yiicsrftoken): void {
    const exec = () => {
      if (!(sid && token)) return of(undefined);
  
      return this.loadInitialData(sid, token).pipe(
        catchError(err => {
          console.error(err);
          return of(undefined);
        })
      );
    };

    if (this.tryLoadInitialDataTimeout) clearTimeout(this.tryLoadInitialDataTimeout);

    this.tryLoadInitialDataTimeout = setTimeout(() => exec().subscribe(), 1000);
  }

  setSettings(settings: QaqSettings | undefined): void {
    this.settings = settings;
    this.settingsChange$.next(settings);
  }

  setData(data: QuestionsAndSubquestionsData | undefined): void {
    this.data = data;
    this.dataChange$.next(data);
  }

  private getValidQuestions(questions: Question[]): Question[] {
    return questions.filter(question => SUPPORTED_QUESTION_TYPES.includes(question.type));
  }
}
