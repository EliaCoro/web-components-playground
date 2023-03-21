import { Component, Input, OnInit, forwardRef } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR, Validators } from '@angular/forms';
import { QuickAddQuotasService } from '../../services/quick-add-quotas.service';
import { Translation } from '@lib/translation';
import { Subject, Subscription, merge } from 'rxjs';
import { AutoDestroy } from '@lib/auto-destroy';
import { take, takeUntil } from 'rxjs/operators';
import { QuestionsAndSubquestionsData } from '@lib/questions-and-subquestions-data';
import { ActionToPerform } from '@lib/action-to-perform';

declare interface TranslationControl {
  lang: string; // Short language code
  message: FormControl;
  url: FormControl;
  urlDescription: FormControl;
  anythingInvalid?: boolean;

  defaultMessage: string;
  language_name: string;
}

@Component({
  selector: 'lib-translations-input',
  templateUrl: './translations-input.component.html',
  styleUrls: [
    './translations-input.component.scss'
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TranslationsInputComponent),
      multi: true
    }
  ]
})
export class TranslationsInputComponent implements OnInit, ControlValueAccessor {

  translations: TranslationControl[] = [];
  private readonly translationsChange$: Subject<Translation[]> = new Subject<Translation[]>();

  @AutoDestroy private readonly destroy$: Subject<void> = new Subject<void>();

  private _isDisabled: boolean = false;
  get isDisabled(): boolean {
    return this._isDisabled;
  }

  @Input() set isDisabled(value: boolean) {
    this.setDisabledState(value);
  }

  private readonly actionToPerformChange$: Subject<number> = new Subject<number>();
  actionToPerform: ActionToPerform = ActionToPerform.Redirect;

  activeTab: number = 0;

  private controlValueChangesUpdate?: Subscription;

  constructor(
    private readonly service: QuickAddQuotasService
  ) {}

  writeValue(obj: Translation[] | any): void {
    if (!(obj instanceof Array && obj.every((t: any) => t instanceof Object))) throw new Error(`Invalid parameter: ${obj}. Array of Translation expected.`);

    if (obj.length == 0) return;

    this.translations = obj;
  }

  registerOnChange(fn: any): void {
    this.translationsChange$.pipe(takeUntil(this.destroy$)).subscribe(fn);
  }

  registerOnTouched(fn: any): void {
    this.translationsChange$.pipe(takeUntil(this.destroy$)).subscribe(() => fn);
  }

  setDisabledState(isDisabled: boolean): void {
    this._isDisabled = isDisabled;
  }

  ngOnInit(): void {
    this.parseData(this.service.data);
    this.service.dataChange$.pipe(takeUntil(this.destroy$)).subscribe((data) => {
      this.parseData(data);
    });
  }

  isInvalid(item: TranslationControl): boolean {
    return false;
    // return !item.lang || !item.language_name;
  }

  private parseData(data: QuestionsAndSubquestionsData | undefined): void {
    // Avoid ovverriding translations if they are already set
    if (this.translations && this.translations.length > 0) return;

    if (!data) {
      return;
    }

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

    const trans: TranslationControl[] = data.i18n.quota_messages.map((t: any) => ({
      lang: t.lang,
      message: newMessage(t.quota_message),
      defaultMessage: t.quota_message,
      language_name: t.language_name,
      url: newUrl(),
      urlDescription: newUrlDescription()
    }));

    this.translationsChange(trans);


    this.controlValueChangesUpdate?.unsubscribe();

    this.controlValueChangesUpdate = merge(...controls.map((c) => c.valueChanges)).pipe(takeUntil(this.destroy$)).subscribe(
      () => {
        // this.notifyChange();
        // console.log('something changed');
        this.calcAnythingInvalid();
      }
    );
  };

  translationsChange(translations: TranslationControl[]): void {
    this.translations = translations;
    this.notifyChange();
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
    // console.log('validated calcAnythingInvalid', { t: this });
    this.translations.forEach((tr) => {
      const urlInvalid = tr.url.invalid && this.showUrl(tr.url);
      const urlDescriptionInvalid = tr.urlDescription.invalid && this.showDescription(tr.urlDescription);
      const messageInvalid = tr.message.invalid && this.showMessage(tr.message);
      tr.anythingInvalid = urlInvalid || urlDescriptionInvalid || messageInvalid;
    });
  }

  private notifyChange(value = this.parseTranslations()): void {
    this.translationsChange$.next(value);
  }

  private parseTranslations(): Translation[] {
    return this.translations.map((t: TranslationControl): Translation => ({
      lang: t.lang,
      message: t.message.value,
      url: t.url.value,
      urlDescription: t.urlDescription.value,
    
      defaultMessage: t.defaultMessage,
      language_name: t.language_name,
    }));
  }
}
