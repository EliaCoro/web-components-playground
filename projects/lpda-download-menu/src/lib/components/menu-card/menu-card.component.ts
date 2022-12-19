import { Component, ElementRef, EventEmitter, HostBinding, HostListener, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Menu } from '../../models';

@Component({
  selector: 'lib-menu-card',
  templateUrl: './menu-card.component.html',
  styleUrls: ['./menu-card.component.scss']
})
export class MenuCardComponent{

  @ViewChild('checkbox') input?: ElementRef<HTMLInputElement>;

  @Output() onClick: EventEmitter<any> = new EventEmitter();

  @Input() menu?: Menu;

  @HostBinding('class.selected') selected: boolean = false;

  // LIsten for click events and emit event to the parent component
  @HostListener('click', ['$event']) click(event: any): void {
    this.updateSelected(!this.selected);
    this.onClick.emit(event);
  }

  checkboxChange(event: any): void {
    this.selected = event.target.checked;
    this.selected = !this.selected;
  }

  updateSelected(selected: boolean): void {
    this.selected = selected;
    const input = this.input?.nativeElement;
    this.selected ? input?.setAttribute('checked', 'checked') : input?.removeAttribute('checked');
  }
}
