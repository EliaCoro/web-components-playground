import { Component, ElementRef, EventEmitter, Input, OnInit, Output, QueryList, SimpleChanges, ViewChild, ViewChildren } from '@angular/core';
import { MenuCardComponent } from './components/menu-card/menu-card.component';
import { Menu } from './models';
import { DownloadFile } from './download-file';

@Component({
  selector: 'lpda-download-menu',
  templateUrl: './lpda-download-menu.component.html',
  styleUrls: ['./lpda-download-menu.component.scss']
})
export class LpdaDownloadMenuComponent {
  private readonly defaultFilename: string = 'menus';

  @Input() filename: string = this.defaultFilename;

  @Output() readonly cancel: EventEmitter<any> = new EventEmitter();
  @Output() readonly onSelected: EventEmitter<Menu[]> = new EventEmitter();
  @Output() readonly downloadSelected: EventEmitter<void> = new EventEmitter();
  @Input() showTitle: boolean = false;

  @ViewChild('checkbox') input?: ElementRef<HTMLInputElement>;

  private _allMenusSelected: boolean = true;
  @Input() set allMenusSelected(v: boolean) {
    this._allMenusSelected = !!v;
    this.updateInputStatus();
    this.updateSelectedByAllMenusSelected();
  }

  get allMenusSelected(): boolean {
    return this._allMenusSelected;
  }

  private _data: Menu[] = [];
  @Input() set data(data: Menu[] | string) {
    if (typeof data === 'string') {
      this._data = JSON.parse(data);
    } else {
      this._data = data;
    }
  }

  get data(): Menu[] {
    return this._data || [];
  }

  selected: Menu[] = this.allMenusSelected ? this.data : [];

  @ViewChildren(MenuCardComponent) menuCards?: QueryList<MenuCardComponent>;

  constructor() {
    this.downloadSelected.subscribe(() => {
      this.downloadMenus();
    })
  }

  ngAfterViewInit(): void {
    this.updateInputStatus();
    this.updateSelectedByAllMenusSelected();
  }

  ngOnChanges(changes: SimpleChanges): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
    if (changes['data']) {
      this.updateSelectedByAllMenusSelected();
    }
  }

  selectedChanged(): void {
    this.selected = this.getSelected();
    this.onSelected.emit(this.selected);
  }

  getSelected(): Menu[] {
    if (!(this.menuCards instanceof QueryList)) return [];

    return this.menuCards.filter((m: MenuCardComponent) => m.selected)
      .map((m: MenuCardComponent) => m.menu)
      .filter((m: Menu | undefined) => m && m != undefined) as Menu[];
  }

  allMenusSelectedChanged(v: boolean): void {
    this.allMenusSelected = !!v;
  }

  private updateInputStatus(): void {
    const input = this.input?.nativeElement;
    this.allMenusSelected ? input?.setAttribute('checked', 'checked') : input?.removeAttribute('checked');
  }

  private updateSelectedByAllMenusSelected(overwriteIfFalse: boolean = true): void {
    if (this.allMenusSelected || overwriteIfFalse) this.menuCards?.forEach((m: MenuCardComponent) => m.updateSelected(this.allMenusSelected));
    this.selectedChanged();
  }

  private downloadMenus(): void {
    this.updateSelectedByAllMenusSelected(false);
    const filename = this.filename || this.defaultFilename;
    const menuName = this.selected.length == 1 ? this.selected[0].name : undefined;
    DownloadFile.download(this.selected, {filename: menuName || filename});
  }
}
