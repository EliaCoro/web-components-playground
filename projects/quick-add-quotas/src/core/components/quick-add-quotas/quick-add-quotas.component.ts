import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { DefaultTranslations } from '@lib/default-translations';
import { environment } from '@lib/env';
import { QuickAddQuotasService } from '../../services/quick-add-quotas.service';
import { QaqDefaultSettings, QaqSettings } from '@lib/qaq-settings';
import { takeUntil } from 'rxjs/operators';
import { AutoDestroy } from '@lib/auto-destroy';
import { Subject } from 'rxjs';
import { FinalFormattedData } from '@lib/final-formatted-data';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'lib-quick-add-quotas',
  templateUrl: `./quick-add-quotas.component.html`,
  styles: []
})
export class QuickAddQuotasComponent {

  private _settings: QaqSettings = QaqDefaultSettings;
  @Input() set settings(value: { [key: string]: any } | undefined | string | (() => any)) {
    this.setSettings(value, true);
  }

  get settings(): { [key: string]: any } | undefined | string | (() => any) {
    return this._settings;
  }

  _showingModal = false;
  get showingModal(): boolean {
    return this._showingModal;
  }

  @AutoDestroy private destroy$: Subject<void> = new Subject<void>();

  constructor(
    private readonly service: QuickAddQuotasService
  ) {
    service.settingsChange$.pipe(takeUntil(this.destroy$)).subscribe((settings?: QaqSettings) => {
      this.setSettings(settings, false);
    });
  }

  showModal(): void {
    this._showingModal = true;
    document.body.classList.add('overflow-hidden');
  }

  hideModal(): void {
    this._showingModal = false;
    document.body.classList.remove('overflow-hidden');
  }

  saveQuotas(data: FinalFormattedData[]): void {
    this.service.saveQuotas(data).subscribe(
      (data: {
        success: boolean,
      }) => {
        if (data.success != false) {
          this.hideModal();
          window.location.reload();
        }
      },
      (er: HttpErrorResponse) => {
        console.error(er);
      },
      () => { }
    )
  }

  private setSettings(value: any, notify: boolean): void {
    let valid: Partial<QaqSettings> = {};
    if (typeof value == 'object') valid = value;
    else if (typeof value == 'string') valid = JSON.parse(value);
    else if (value == undefined) valid = {};
    else if (typeof value == 'function') valid = value();

    // Downcase all keys
    let downcased: { [key: string]: any } = {};
    for (let key in valid) {
      downcased[key.toLowerCase()] = (valid as any)[key];
    }
    valid = downcased;

    this._settings = { ...QaqDefaultSettings, ...valid };

    if (notify) this.service.setSettings(this._settings);
  }
}
