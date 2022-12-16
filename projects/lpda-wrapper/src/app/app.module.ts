import { Injector, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';

import { createCustomElement } from '@angular/elements';
import { LpdaFiltersComponent, LpdaFiltersModule } from 'projects/lpda-filters/src/public-api';

export abstract class WebComponentModule {
  constructor(injector: Injector, component: InstanceType<any>, name: string) {
    const ngElement = createCustomElement(component, {
      injector,
    });
    // change the first parameter to change the name of the HTML tag generated
    customElements.define(`lpda-${name}`, ngElement);
  }

  public ngDoBootstrap(): void { }
}

@NgModule({
  imports: [
    BrowserModule,
    LpdaFiltersModule
  ],
  entryComponents: [LpdaFiltersComponent]
})
export class AppModule extends WebComponentModule {
  constructor(
    readonly injector: Injector,
  ) {
    super(injector, LpdaFiltersComponent, 'filters');
  }
}
