import { HttpClient } from '@angular/common/http';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Injectable } from '@angular/core';
import { ActionToPerform } from '@lib/action-to-perform';
import { Answer } from '@lib/answer';
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

  yiiCsrfToken?: string;
  readonly yiiCsrfTokenChange: Subject<string | undefined> = new Subject();

  translations?: Record<string, string>;
  readonly translsationsChange: Subject<Record<string, string> | undefined> = new Subject();

  sid?: number | string;
  readonly sidChange: Subject<number | string | undefined> = new Subject();

  data?: QuestionsAndSubquestionsData;
  readonly dataChange: Subject<QuestionsAndSubquestionsData | undefined> = new Subject();

  questions?: Question[];
  readonly questionsChange: Subject<Question[] | undefined> = new Subject();

  selectedQuestions?: Question[];
  readonly selectedQuestionsChange: Subject<Question[] | undefined> = new Subject();

  messages?: { lang: string, message: string, urlDescription: string, url: string }[];
  readonly messagesChange$: Subject<{ lang: string, message: string, urlDescription: string, url: string }[] | undefined> = new Subject();

  actionToPerform?: ActionToPerform;
  readonly actionToPerformChange$: Subject<ActionToPerform | undefined> = new Subject();

  quotaAction?: QuotaAction;
  readonly quotaActionChange$: Subject<QuotaAction | undefined> = new Subject();

  autoloadUrl?: boolean;
  readonly autoloadUrlChange$: Subject<boolean | undefined> = new Subject();

  quotaType?: QuotaType;
  readonly quotaTypeChange$: Subject<QuotaType | undefined> = new Subject();

  showModal: boolean = false;
  readonly showModalChange$: Subject<boolean | undefined> = new Subject();

  constructor(
    private readonly http: HttpClient
  ) {
    this.dataChange.subscribe(data => {
      this.setQuestions(this.getValidQuestions(data));
    });

    merge(
      this.sidChange,
      this.yiiCsrfTokenChange,
      this.dataChange,
      this.questionsChange,
      this.selectedQuestionsChange,
      this.messagesChange$,
      this.actionToPerformChange$,
      this.quotaActionChange$,
      this.autoloadUrlChange$,
      this.quotaTypeChange$,
      this.showModalChange$
    ).subscribe(() => {
      console.log("QuickAddQuotasService state changed", this);
    });
  }

  getInitialData(sid: number = this.sid as number, token: string = this.yiiCsrfToken as string): Observable<QuestionsAndSubquestionsData> {
    if (!(sid)) throw new Error("sid must be set before calling getInitialData()");
    if (!(token)) throw new Error("token must be set before calling getInitialData()");

    const urlTemplate = '/index.php/surveyAdministration/quickAddQuotasInfo/surveyid/{{sid}}?YII_CSRF_TOKEN={{token}}';

    const url = urlTemplate.replace("{{sid}}", sid.toString()).replace("{{token}}", token);

    return this.http.get<QuestionsAndSubquestionsData>(url).pipe(tap((data: any) => {
      this.setData(data);
    }))
  }

  saveQuotas(): Observable<any> {
    const data = this.getParsedData();
    console.log("Saving quotas", { self: this, data });
    return of("cià");


    return this.http.post('/index.php/surveyAdministration/quickAddQuotas/surveyid/' + this.sid, data);
  }

  private loadDataSub?: Subscription;
  tryGetInitialData(): void {
    if (!(this.sid && this.yiiCsrfToken)) {
      console.debug('tryGetInitialData() - sid or yiiCsrfToken not set, not trying to get initial data');
      return;
    }

    this.loadDataSub?.unsubscribe();

    this.loadDataSub = this.getInitialData().subscribe();
  }

  reset(): void {
    this.setSid(undefined);
    this.setYiiCsrfToken(undefined);
    this.setData(undefined);
    this.setQuestions(undefined);
    this.setSelectedQuestions(undefined);
    this.setMessages(undefined);
    this.setActionToPerform(undefined);
    this.setQuotaType(undefined);
    this.setShowModal(false);
  }

  setTranslations(translations: Record<string, string> | undefined) {
    this.translations = translations;
    this.translsationsChange.next(this.translations);
  }

  setYiiCsrfToken(token: string | undefined) {
    console.log("Setting token to: ", token);
    this.yiiCsrfToken = token;
    this.yiiCsrfTokenChange.next(this.yiiCsrfToken);
  }

  setSid(sid: string | number | undefined) {
    this.sid = sid;
    this.sidChange.next(this.sid);
  }

  setData(data: QuestionsAndSubquestionsData | undefined) {
    this.data = data;
    this.dataChange.next(this.data);
  }

  setQuestions(questions: Question[] | undefined) {
    this.questions = questions;
    this.questionsChange.next(this.questions);
  }

  setSelectedQuestions(questions: Question[] | undefined) {
    this.selectedQuestions = questions;
    this.selectedQuestionsChange.next(this.selectedQuestions);
  }

  setMessages(messages: { lang: string, message: string, urlDescription: string, url: string }[] | undefined) {
    this.messages = messages;
    this.messagesChange$.next(this.messages);
  }

  setActionToPerform(action: ActionToPerform | undefined) {
    this.actionToPerform = action;
    this.actionToPerformChange$.next(this.actionToPerform);
  }

  setShowModal(showModal: boolean): void {
    this.showModal = showModal;
    this.showModalChange$.next(this.showModal);
  }

  setQuotaType(quotaType: QuotaType | undefined) {
    this.quotaType = quotaType;
    this.quotaTypeChange$.next(this.quotaType);
  }

  setQuotaAction(quotaAction: QuotaAction | undefined) {
    this.quotaAction = quotaAction;
    this.quotaActionChange$.next(this.quotaAction);
  }

  setAutoloadUrl(autoloadUrl: boolean | undefined) {
    this.autoloadUrl = autoloadUrl;
    this.autoloadUrlChange$.next(this.autoloadUrl);
  }

  private getValidQuestions(data = this.data): Question[] {
    if (!(data && data.questions)) return [];

    return data.questions.filter((question: Question) => {
      return question.answers && question.answers.length > 0 && question.type && SUPPORTED_QUESTION_TYPES.includes(question.type);
    }).sort((a: Question, b: Question) => {
      return a.question_order - b.question_order;
    });
  }

  private getParsedData(): any[] {
    const final: {
      quota: {
        sid: number,
        qlimit: number,
        name: string,
        autoload_url: 0 | 1,
        active: 0 | 1,
        action: QuotaAction,
      },
      quota_members: {
        sid: number,
        qid: number,
        code: string
      }[],
      language_settings: {
        quotals_language: string,
        quotals_message: string,
        quotals_name: string,
        quotals_url: string,
        quotals_urldescrip: string,
      }[];
    }[] = [];

    const language_settings = (this.messages ||[]).map((message) => ({
      quotals_language: message.lang,
      quotals_message: message.message,
      quotals_name: message.message,
      quotals_url: message.url,
      quotals_urldescrip: message.urlDescription,
    }));

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
          active: 1,
          // action: data.action,
          action: this.quotaAction!,
          autoload_url: this.autoloadUrl ? 1 : 0,
          name: data.name,
          qlimit: data.qlimit,
          sid: this.sid as number,
        },
        quota_members: data.quota_members.map((member) => ({
          ...member,
          sid: this.sid as number,
        })),
      });
    };

    return final;
  }
}
