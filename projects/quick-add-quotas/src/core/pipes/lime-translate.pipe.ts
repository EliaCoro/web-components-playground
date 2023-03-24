import { OnDestroy, Pipe, PipeTransform } from '@angular/core';
import { QuickAddQuotasService } from '../services/quick-add-quotas.service';
import { text2key } from '@lib/text2key';
import { limeTranslate } from '@lib/lime-translate';
import { AutoDestroy } from '@lib/auto-destroy';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Pipe({
  name: 'limeTranslate'
})
export class LimeTranslatePipe implements PipeTransform {

  private translations?: Record<string, string>;

  @AutoDestroy private readonly destroy$: Subject<void> = new Subject<void>();

  constructor(
    service: QuickAddQuotasService
  ) {
    service.translations$.pipe(takeUntil(this.destroy$)).subscribe((translations: Record<string, string>) => {
      this.translations = translations;
    });
  }

  transform(value: string | undefined): string {
    return limeTranslate(value, this.translations);
  }
}
