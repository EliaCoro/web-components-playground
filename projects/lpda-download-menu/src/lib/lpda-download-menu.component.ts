import { Component, EventEmitter, Input, OnInit, Output, QueryList, ViewChildren } from '@angular/core';
import { MenuCardComponent } from './components/menu-card/menu-card.component';
import { Menu } from './models';

@Component({
  selector: 'lpda-download-menu',
  templateUrl: './lpda-download-menu.component.html',
  styles: []
})
export class LpdaDownloadMenuComponent {

  @Output() onSelected: EventEmitter<Menu[]> = new EventEmitter();

  private _data: Menu[] = [];
  @Input() set data(data: Menu[]|string) {
    if (typeof data === 'string') {
      this._data = JSON.parse(data);
    } else {
      this._data = data;
    }
  }

  get data(): Menu[]{
    return this._data || [];
  }

  @ViewChildren(MenuCardComponent) menuCards?: QueryList<MenuCardComponent>;

  selectedChanged(): void {
    this.onSelected.emit(this.getSelected());
  }

  getSelected(): Menu[] {
    if (!(this.menuCards instanceof QueryList)) return [];

    return this.menuCards.filter((m: MenuCardComponent) => m.selected)
                         .map((m: MenuCardComponent) => m.menu)
                         .filter((m: Menu|undefined) => m && m != undefined) as Menu[];
  }
}
