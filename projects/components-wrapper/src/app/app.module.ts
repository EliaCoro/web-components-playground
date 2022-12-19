import { Injector, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';

import { createCustomElement } from '@angular/elements';
import { LpdaDownloadMenuComponent } from 'projects/lpda-download-menu/src/public-api';
import { LpdaDownloadMenuModule } from 'lpda-download-menu';

export abstract class WebComponentModule {
  constructor(injector: Injector, component: InstanceType<any>, name: string) {
    const ngElement = createCustomElement(component, {
      injector,
    });
    // change the first parameter to change the name of the HTML tag generated
    customElements.define(`${name}`, ngElement);
  }

  public ngDoBootstrap(): void { }
}

@NgModule({
  imports: [
    BrowserModule,
    LpdaDownloadMenuModule,
  ],
  entryComponents: [LpdaDownloadMenuComponent]
})
export class AppModule extends WebComponentModule {
  constructor(
    readonly injector: Injector,
  ) {
    super(injector, LpdaDownloadMenuComponent, 'lpda-download-menu');
  }
}
