import { Injector, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';

import { createCustomElement } from '@angular/elements';
import { QuickAddQuotasModule } from "/home/elia/Scrivania/web-components-playground/projects/quick-add-quotas/src/core/quick-add-quotas.module";
import { QuickAddQuotasComponent } from "/home/elia/Scrivania/web-components-playground/projects/quick-add-quotas/src/core/components/quick-add-quotas/quick-add-quotas.component";

export abstract class WebComponentModule {
  constructor(injector: Injector, component: InstanceType<any>, name: string) {
    const ngElement = createCustomElement(component, {
      injector,
    });
    // change the first parameter to change the name of the HTML tag generated
    customElements.define(name, ngElement);
  }

  public ngDoBootstrap(): void { }
}

@NgModule({
  imports: [
    BrowserModule,
    QuickAddQuotasModule
  ],
  entryComponents: [
    QuickAddQuotasComponent
  ]
})
export class AppModule extends WebComponentModule {
  constructor(
    readonly injector: Injector,
  ) {
    super(injector, QuickAddQuotasComponent, 'quick-add-quotas');
  }
}
