import { HttpClient } from '@angular/common/http';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Injectable } from '@angular/core';
import { ActionToPerform } from '@lib/action-to-perform';
import { Answer } from '@lib/answer';
import { FinalFormattedData } from '@lib/final-formatted-data';
import { limeTranslate } from '@lib/lime-translate';
import { QaqSettings } from '@lib/qaq-settings';
import { Question } from '@lib/question';
import { QuestionsAndSubquestionsData } from '@lib/questions-and-subquestions-data';
import { QuotaAction } from '@lib/quota-action';
import { QuotaType } from '@lib/quota-type';
import { text2key } from '@lib/text2key';
import { NgSelectConfig } from '@ng-select/ng-select';
import { BehaviorSubject, Observable, Subject, Subscription, merge, of } from 'rxjs';
import { catchError, concatAll, map, takeUntil, tap } from 'rxjs/operators';

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

  readonly errorMessages$: BehaviorSubject<Record<string, string>> = new BehaviorSubject<Record<string, string>>({});

  readonly translations$: BehaviorSubject<Record<string, string>> = new BehaviorSubject<Record<string, string>>({});
  private translations?: Record<string, string>;

  readonly destroy$: Subject<void> = new Subject<void>();

  constructor(
    private readonly http: HttpClient,
    private readonly ngSelectConfig: NgSelectConfig
  ) {
    this.translations$.pipe(takeUntil(this.destroy$)).subscribe(translations => this.translations = translations)

    this.settingsChange$.pipe(takeUntil(this.destroy$)).subscribe(settings => {
      this.errorMessages$.next(settings?.errormessages ?? {});

      this.updateTranslationsBySettings(settings);
      this.updateNgSelectTranslationsBySettings(settings);
    });
  }

  loadInitialData(url: string | undefined = this.settings?.load_data_url, token: string | undefined = this.settings?.yiicsrftoken): Observable<QuestionsAndSubquestionsData> {
    if (!(url && token)) throw new Error(`url and token must be defined. url: ${url}, token: ${token}`);

    //const urlTemplate = '/index.php/surveyAdministration/quickAddQuotasInfo/surveyid/{{sid}}?YII_CSRF_TOKEN={{token}}&lang={{lang}}';

    //const url = urlTemplate.replace("{{sid}}", sid.toString()).replace("{{token}}", token).replace("{{lang}}", this.settings?.lang ?? "en");
    console.log("loadInitialData url: " + url);
    return this.http.get<QuestionsAndSubquestionsData>(url).pipe(
      tap(data => this.setData(data))
    );
  }

  private tryLoadInitialDataTimeout: any;
  tryLoadInitialData(url: string | undefined = this.settings?.load_data_url, token: string | undefined = this.settings?.yiicsrftoken): void {
    const exec = () => {
      console.log()
      if (!(url && token)) return of(undefined);
      console.log("try load initial data url: "+url);

      return this.loadInitialData(url, token).pipe(
        catchError(err => {
          console.error(err);
          return of(undefined);
        })
      );
    };

    if (this.tryLoadInitialDataTimeout) clearTimeout(this.tryLoadInitialDataTimeout);

    this.tryLoadInitialDataTimeout = setTimeout(() => exec().subscribe(), 1000);
  }

  saveQuotas(
    data: FinalFormattedData[],
    url: string | undefined = this.settings?.save_quota_surl,
    token: string | undefined = this.settings?.yiicsrftoken
  ): Observable<any> {
    if (!(url && token)) throw new Error(`url and token must be defined. url: ${url}, token: ${token}`);

    //const urlTemplate = '/index.php/surveyAdministration/quickAddQuotas/surveyid/{{sid}}';

    //const url = urlTemplate.replace("{{sid}}", sid.toString());

    console.log("saveQuotas url: " + url);
    const body = new URLSearchParams();
    body.set('YII_CSRF_TOKEN', token);
    body.set('payload', JSON.stringify(data));

    const options = {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    };

    return this.http.post<any>(url, body.toString(), options);
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

  private updateTranslationsBySettings(settings: QaqSettings | undefined): void {
    const newTranslations: Record<string, string> = {};
    const translations: Record<string, string> = settings?.translations ?? {};

    Object.keys(translations).forEach(key => {
      if (translations[key] === "") delete translations[key];

      translations[text2key(key)] = translations[key];
    });

    this.translations$.next(translations);
  }

  private updateNgSelectTranslationsBySettings(settings: QaqSettings | undefined): void {
    const t = this.translations ?? {};

    this.ngSelectConfig.clearAllText     = limeTranslate(`Clear`, t);
    this.ngSelectConfig.notFoundText     = limeTranslate(`Not found`, t);
    this.ngSelectConfig.typeToSearchText = limeTranslate(`Type to search`, t);
    this.ngSelectConfig.addTagText       = limeTranslate(`Add`, t);
    this.ngSelectConfig.loadingText      = limeTranslate(`Loading...`, t);
    this.ngSelectConfig.placeholder      = limeTranslate(`Select`, t);
  }
}
