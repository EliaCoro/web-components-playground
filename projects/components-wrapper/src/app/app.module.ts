import { Injector, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';

import { createCustomElement } from '@angular/elements';

// import { YourModule } from './your.module';
// import { YourComponent } from './your.component';

// TODO use a function instead of an abstract class
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
    // YourModule
  ],
  entryComponents: [
    // YourComponent
  ]
})
export class AppModule extends WebComponentModule {
  constructor(
    readonly injector: Injector,
  ) {
    // super(injector, YourComponent, 'your-component');
    super(injector, AppModule, 'lpda-download-menu');
  }
}
