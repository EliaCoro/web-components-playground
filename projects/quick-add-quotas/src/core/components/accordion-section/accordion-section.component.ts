import { Component, HostBinding, Input, OnInit } from '@angular/core';

@Component({
  selector: 'lib-accordion-section',
  templateUrl: './accordion-section.component.html',
  styleUrls: [
    './accordion-section.component.scss',
  ]
})
export class AccordionSectionComponent implements OnInit {

  @Input() title?: string;

  @HostBinding('class.expanded')
  @Input() expanded: boolean = false;

  @Input() index?: number;

  constructor() { }

  ngOnInit(): void {}
}
