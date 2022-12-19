import { Component, EventEmitter, HostBinding, HostListener, Input, OnInit, Output } from '@angular/core';
import { Menu } from '../../models';

@Component({
  selector: 'lib-menu-card',
  templateUrl: './menu-card.component.html',
  styleUrls: ['./menu-card.component.scss']
})
export class MenuCardComponent{

  @Output() onClick: EventEmitter<any> = new EventEmitter();

  @Input() menu?: Menu;

  @HostBinding('class.selected') selected: boolean = false;

  // LIsten for click events and emit event to the parent component
  @HostListener('click', ['$event']) click(event: any): void {
    this.selected = !this.selected;
    this.onClick.emit(event);
  }
}
