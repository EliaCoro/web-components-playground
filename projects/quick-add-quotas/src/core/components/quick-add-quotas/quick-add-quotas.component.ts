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

  @Input(`yiicsrftoken`) set yiiCsrfToken(value: string | undefined) {
    this.service.setYiiCsrfToken(value);
  }

  get yiiCsrfToken() {
    return this.service.yiiCsrfToken;
  }

  @Input("debugmode") debugMode: boolean = environment.debugMode;

  @Input("sid") set surveyId(value: string | number | undefined) {
    this.service.setSid(value);
  }

  get surveyId(): string | number | undefined {
    return this.service.sid;
  }

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

  get data(): any {
    return this.service.data;
  }

  set data(v: any) {
    this.service.setData(v);
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

  constructor(
    private readonly service: QuickAddQuotasService,
  ) { }

  ngOnChanges(changes: SimpleChanges): void {}

  ngOnInit(): void {}

  showModal(): void {
    this.service.setShowModal(true);
  }

  hideModal(): void {
    this.service.setShowModal(false);
  }

}
