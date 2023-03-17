import { Component, HostBinding, OnInit } from '@angular/core';
import { QuickAddQuotasService } from '../../services/quick-add-quotas.service';
import { AutoDestroy } from '@lib/auto-destroy';
import { Observable, Subject, Subscription, merge } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { QuestionsAndSubquestionsData } from '@lib/questions-and-subquestions-data';
import { AbstractControl, FormControl, Validators } from '@angular/forms';
import { Action } from 'rxjs/internal/scheduler/Action';
import { urlencoded } from 'express';
import { ActionToPerform } from '@lib/action-to-perform';
import { QuotaType } from '@lib/quota-type';
import { QuotaAction } from '@lib/quota-action';

@Component({
  selector: 'lib-action-end-setup',
  templateUrl: './action-end-setup.component.html',
  styleUrls: ['./action-end-setup.component.scss']
})
export class ActionEndSetupComponent implements OnInit {
  @HostBinding('class.hidden') private hidden: boolean = true;

  quotaAction: QuotaAction = QuotaAction.Terminate;
  readonly quotaActionChange$: Subject<QuotaAction> = new Subject<QuotaAction>();

  @AutoDestroy destroy$: Subject<void> = new Subject<void>();

  private readonly actionToPerformChange$: Subject<number> = new Subject<number>();
  actionToPerform: ActionToPerform = ActionToPerform.Redirect;

  private readonly quotaTypeChange$: Subject<QuotaType> = new Subject<QuotaType>();
  quotaType: QuotaType = QuotaType.Quota;


  private readonly activeTabChange$: Subject<number> = new Subject<number>();

  _activeTab: number = 0;
  get activeTab(): number {
    return this._activeTab;
  }

  set activeTab(value: number) {
    if (value == this._activeTab) return;

    this._activeTab = value;
    this.activeTabChange$.next(value);
  }

  finalActions: {
    url: FormControl;
    urlDescription: FormControl;
    message: FormControl;
    lang: string;
    language_name: string;
    defaultMessage: string;

    anythingInvalid?: boolean;
  }[] = [];

  constructor(
    private readonly service: QuickAddQuotasService
  ) {
    service.selectedQuestionsChange.pipe(takeUntil(this.destroy$)).subscribe((questions) => {
      this.hidden = questions && questions.length && questions.length > 0 ? false : true;
    });

    this.quotaActionChange$.pipe(takeUntil(this.destroy$)).subscribe((quotaAction) => {
      this.service.setQuotaAction(quotaAction);
    });

    this.quotaTypeChange$.pipe(takeUntil(this.destroy$)).subscribe((quotaType) => {
      this.service.setQuotaType(quotaType);
    });

    this.actionToPerformChange$.pipe(takeUntil(this.destroy$)).subscribe((actionToPerform) => {
      this.service.setActionToPerform(actionToPerform);
    });

    merge(
      this.activeTabChange$,
      this.actionToPerformChange$
    ).pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.calcAnythingInvalid();
    });

    service.dataChange.pipe(takeUntil(this.destroy$)).subscribe((data) => {
      this.manageDataChange(data?.i18n?.quota_messages ?? [])
      this.calcAnythingInvalid();
    });
  }

  ngOnInit(): void { }

  ngAfterViewInit(): void {}

  save(): void {
    this.saveChanges();

    this.service.saveQuotas().subscribe(() => {
      this.close();
    }, (errors: any) => {
      console.error(errors);
    });
  }

  cancel(): void {
    if (!confirm('Are you sure you want to cancel?')) return;

    this.close();
  }

  updateQuotaAction(quotaAction: QuotaAction): void {
    this.quotaAction = quotaAction;
    this.quotaActionChange$.next(quotaAction);
  }

  private close(){
    this.service.reset();
    this.service.setShowModal(false);
  }

  getIdFor(index: number, item: Record<string, any> & { lang: string }) {
    return `item-${index}-${item.lang}`;
  }

  showUrl(control: FormControl): boolean {
    return control != undefined && this.actionToPerform == ActionToPerform.MessageAndRedirect || this.actionToPerform == ActionToPerform.Redirect;
  }

  showDescription(control: FormControl): boolean {
    return control != undefined && this.actionToPerform == ActionToPerform.MessageAndRedirect;
  }

  showMessage(control: FormControl): boolean {
    return control != undefined && this.actionToPerform == ActionToPerform.MessageAndRedirect || this.actionToPerform == ActionToPerform.Message;
  }

  private calcAnythingInvalid(): void {
    console.log('validated calcAnythingInvalid', { t: this });
    this.finalActions.forEach((action) => {
      const urlInvalid = action.url.invalid && this.showUrl(action.url);
      const urlDescriptionInvalid = action.urlDescription.invalid && this.showDescription(action.urlDescription);
      const messageInvalid = action.message.invalid && this.showMessage(action.message);
      action.anythingInvalid = urlInvalid || urlDescriptionInvalid || messageInvalid;
    });
  }

  private saveChanges(): void {
    this.service.setMessages(this.finalActions.map((action) => ({
        url: action.url.value,
        urlDescription: action.urlDescription.value,
        message: action.message.value,
        lang: action.lang,
    })));

    this.service.setActionToPerform(this.actionToPerform);
  }

  private controlValueChangesUpdate?: Subscription;
  private manageDataChange(messages: QuestionsAndSubquestionsData['i18n']['quota_messages']): void {
    const controls: FormControl[]= [];
    const newControl = (value: any, validators: any[] | any = []) => {
      const c = new FormControl(value, validators);
      controls.push(c);
      return c;
    };

    const newUrl = (v: any = null) => newControl(v, [
      Validators.required,
      Validators.pattern('^(https?:\\/\\/)?' + // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
        '(\\#[-a-z\\d_]*)?$') // fragment locator
    ]);


    const newUrlDescription = (v: any = null) => newControl(v, []);

    const newMessage = (v: any = null) => newControl(v, [
      Validators.required,
      Validators.minLength(1),
      Validators.maxLength(255)
    ]);

    this.finalActions = messages.map((m: QuestionsAndSubquestionsData['i18n']['quota_messages'][number]) => {
      const url = newUrl();

      const urlDescription = newUrlDescription()

      const message = newMessage(m.message);

      return {
        lang: m.lang,
        language_name: m.language_name,
        defaultMessage: m.message,
        url, urlDescription, message
      }
    });


    this.controlValueChangesUpdate?.unsubscribe();

    this.controlValueChangesUpdate = merge(...controls.map((c) => c.valueChanges)).pipe(takeUntil(this.destroy$)).subscribe(
      () => {
        console.log('something changed');
        this.calcAnythingInvalid();
      }
    );
  }

  updateQuotaType(quotaType: QuotaType): void {
    this.quotaType = quotaType;
    this.quotaTypeChange$.next(quotaType);
  }
}
