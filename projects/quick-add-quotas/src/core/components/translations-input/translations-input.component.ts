import { ChangeDetectorRef, Component, ElementRef, Input, OnInit, QueryList, ViewChildren, forwardRef } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR, Validators } from '@angular/forms';
import { QuickAddQuotasService } from '../../services/quick-add-quotas.service';
import { Translation } from '@lib/translation';
import { Subject, Subscription, merge } from 'rxjs';
import { AutoDestroy } from '@lib/auto-destroy';
import { debounceTime, take, takeUntil, tap } from 'rxjs/operators';
import { QuestionsAndSubquestionsData } from '@lib/questions-and-subquestions-data';
import { ActionToPerform, defaultActionToPerform } from '@lib/action-to-perform';

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

  @ViewChildren("focusableInput") inputs?: QueryList<ElementRef<HTMLInputElement | HTMLTextAreaElement>>;

  @Input() autofocus: boolean = true;

  writing: boolean = false;

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

  private _actionToPerform: ActionToPerform = ActionToPerform.Redirect;

  @Input() set actionToPerform(value: ActionToPerform | undefined) {
    this.actionToPerformChange(value ?? defaultActionToPerform);
  }

  get actionToPerform(): ActionToPerform | undefined {
    return this._actionToPerform ?? defaultActionToPerform;
  }

  constructor(
    private readonly service: QuickAddQuotasService
  ) { }

  writeValue(obj: Translation[]): void {
    if (!(obj instanceof Array && obj.every((t: any) => t instanceof Object))) throw new Error(`Invalid parameter: ${obj}. Array of Translation expected.`);

    if (obj.length == 0) return;

    const translations = obj.map((t: Translation) => {
      return {
        lang: t.lang,
        message: this.newMessageControl(t.message),
        url: this.newUrlControl(t.url),
        urlDescription: this.newUrlDescriptionControl(t.urlDescription),
        defaultMessage: t.defaultMessage,
        language_name: t.language_name
      };
    });

    this.translationsChange(translations, false);
  }

  showErrors(item: TranslationControl, field: 'urlDescription' | 'url' | 'message'): boolean {
    if (this.writing) return false;

    const control: FormControl = item[field];
    return control.invalid && (control.dirty || control.touched);
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

    this.actionToPerformChange$.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.calcAnythingInvalid();
    });
  }

  actionToPerformChange(action: ActionToPerform): void {
    this._actionToPerform = action;
    this.actionToPerformChange$.next(action);
  }

  ngAfterViewInit(): void {
    this.calcAnythingInvalid();
    this.autofocus && this.focusFirstInput();
  }

  @Input() private filterInputs = (input: HTMLInputElement | HTMLTextAreaElement) => {
    return !input.disabled;
  }

  focusFirstInput(): void {
    if (!this.inputs) return;

    const input: undefined | HTMLInputElement | HTMLTextAreaElement = this.inputs.map(l => l.nativeElement).filter(this.filterInputs ?? (() => true))[0];
    input?.focus();
  }

  /**
   * Function to call on each keypress
   */
  private writingTimeout?: any;
  private stillWriting(): void {
    this.writing = true;
    clearTimeout(this.writingTimeout);

    this.writingTimeout = setTimeout(() => {
      this.writing = false;
    }, 1000);
  }

  private readonly newMessageControl = (v: any = null) => new FormControl(v, Validators.required);

  private readonly newUrlDescriptionControl = (v: any = null) => new FormControl(v);

  private readonly newUrlControl = (v: any = null) => new FormControl(v, [
    Validators.required,
    Validators.pattern('^(https?:\\/\\/)?' + // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
      '(\\#[-a-z\\d_]*)?$') // fragment locator
  ]);

  private parseData(data: QuestionsAndSubquestionsData | undefined): void {
    // Avoid ovverriding translations if they are already set
    if (this.translations && this.translations.length > 0) return;

    if (!data) { return; }

    const controls: FormControl[] = [];
    const urlControls: FormControl[] = [];

    const newUrl = (v: any = null): FormControl => {
      const control = this.newUrlControl(v);
      controls.push(control);
      urlControls.push(control);
      return control;
    }

    const newUrlDescription = (v: any = null): FormControl => {
      const control = this.newUrlDescriptionControl(v);
      controls.push(control);
      return control;
    };

    const newMessage = (v: any = null): FormControl => {
      const control = this.newMessageControl(v);
      controls.push(control);
      return control;
    };

    const trans: TranslationControl[] = data.i18n.quota_messages.map(t => ({
      lang: t.lang,
      message: newMessage(t.message),
      defaultMessage: t.message,
      language_name: t.language_name,
      url: newUrl(),
      urlDescription: newUrlDescription()
    }));

    this.translationsChange(trans);

    // This is useful to emit changes even if the user doesn't change anything.
    // In this way parent component has this data even if empty.
    setTimeout(() => { this.notifyChange(); });
  };

  translationsChange(translations: TranslationControl[], notifyChanges: boolean = true): void {
    this.translations = translations;

    notifyChanges && this.notifyChange();

    this.startListeningChanges();
  }

  // Resetting onDestroy
  private controlValueChangesUpdate?: Subscription;
  private startListeningChanges(): void {
    const controls: FormControl[] = this.translations.map(t => [t.message, t.url, t.urlDescription]).reduce((a, b) => a.concat(b), []);
    const urlControls: FormControl[] = this.translations.map(t => t.url);

    this.controlValueChangesUpdate?.unsubscribe();
    this.controlValueChangesUpdate = merge(...controls.map(c => c.valueChanges)).pipe(
      takeUntil(this.destroy$),
      // Need to do this two operations without debounceTime because otherwise the value is not updated
      tap(() => this.stillWriting()),
      tap(() => this.calcAnythingInvalid()),
      debounceTime(500)
    ).subscribe(() => this.notifyChange());

    // When user sets first link, all other links are set to the same value if they are empty and untouched
    if (urlControls && Array.isArray(urlControls) && urlControls.length > 1) {
      urlControls[0].valueChanges.pipe(takeUntil(this.destroy$)).subscribe((v) => {
        if (!v) return;

        urlControls.slice(1).forEach((c) => {
          if (!c.dirty) c.setValue(v);
        });
      });
    }
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
