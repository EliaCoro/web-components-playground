import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { DefaultTranslations } from '@lib/default-translations';
import { environment } from '@lib/env';
import { QuickAddQuotasService } from '../../services/quick-add-quotas.service';

@Component({
  selector: 'lib-quick-add-quotas',
  templateUrl: `./quick-add-quotas.component.html`,
  styles: []
})
export class QuickAddQuotasComponent implements OnInit {

  @Input(`yiicsrftoken`) yiiCsrfToken?: string;

  @Input("debugmode") debugMode: boolean = environment.debugMode;

  @Input("sid") surveyId?: string;

  @Input() set translations(value: {[key: string]: string} | undefined | string) {
    let valid: {[key: string]: string} = {};
    if (typeof value == 'object') valid = value;
    else if (typeof value == 'string') valid = JSON.parse(value);
    else if (value == undefined) valid = {};

    // this.service.translations = valid;
    this.service.setTranslations(valid);
  }

  get translations() {
    return this.service.translations;
  }

  @Input() set settings(value: {[key: string]: any} | undefined | string | (() => any)) {
    let valid: {[key: string]: any} = {};
    if (typeof value == 'object') valid = value;
    else if (typeof value == 'string') valid = JSON.parse(value);
    else if (value == undefined) valid = {};
    else if (typeof value == 'function') valid = value();

    // Downcase all keys
    let downcased: {[key: string]: any} = {};
    for (let key in valid) {
      downcased[key.toLowerCase()] = valid[key];
    }
    valid = downcased;

    if (valid['sid'])          this.surveyId     = valid['sid'];          delete valid['sid'];
    if (valid['surveyid'])     this.surveyId     = valid['surveyid'];     delete valid['surveyid'];
    if (valid['yiicsrftoken']) this.yiiCsrfToken = valid['yiicsrftoken']; delete valid['yiicsrftoken'];
    if (valid['token'])        this.yiiCsrfToken = valid['token'];        delete valid['token'];
    if (valid['translations']) this.translations = valid['translations']; delete valid['translations'];
    if (valid['debugmode'])    this.debugMode    = valid['debugmode'];    delete valid['debugmode'];

    for(let key in valid) {
      console.warn(`Unknown setting "${key}"`);
    }
  }

  showingModal: boolean = false;

  get debugData() {
    return {
      showModal: this.showModal,
      yiiCsrfToken: this.yiiCsrfToken,
      surveyId: this.surveyId,
      translations: this.translations,
      showingModal: this.showingModal,
    }
  }

  constructor(
    private readonly service: QuickAddQuotasService,
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
    console.log('ngOnChanges', this, changes);
  }

  ngOnInit(): void {}

  showModal(): void {
    this.showingModal = true;
  }

  hideModal(): void {
    this.showingModal = false;
  }

}
