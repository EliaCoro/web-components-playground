import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'lib-style',
  template: '',
  styles: [
    `@import "~@ng-select/ng-select/themes/default.theme.css";`,
  ],
  styleUrls: [
    `./style.component.scss`,
  ],
  encapsulation: ViewEncapsulation.None
})
export class StyleComponent {}
