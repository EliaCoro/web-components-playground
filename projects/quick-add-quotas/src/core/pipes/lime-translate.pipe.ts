import { Pipe, PipeTransform } from '@angular/core';
import { QuickAddQuotasService } from '../services/quick-add-quotas.service';
import { text2key } from '@lib/text2key';

@Pipe({
  name: 'limeTranslate'
})
export class LimeTranslatePipe implements PipeTransform {

  constructor(
    private readonly service: QuickAddQuotasService
  ){}

  transform(value: string | undefined): string {
    return value || '';
    // if(!(value && typeof value == 'string' && value.length > 0)) return value || '';
    // if (!(this.service.translations)) return value;
    // const key = text2key(value);
    // if (!(this.service.translations[key])) return value;

    // return this.service.translations[key];
  }
}
