import { Component, ElementRef, EventEmitter, Input, OnInit, Output, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { MenuCardComponent } from './components/menu-card/menu-card.component';
import { Menu } from './models';
import { ActivatedRoute } from '@angular/router';
import * as XLSX from "xlsx";
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
  @Output() readonly download: EventEmitter<Menu[]> = new EventEmitter<Menu[]>();
  @Output() readonly onSelected: EventEmitter<Menu[]> = new EventEmitter();

  @ViewChild('checkbox') input?: ElementRef<HTMLInputElement>;

  /**
   * Should the component generate a file and download it when the download button is clicked?
   * you may set this to false if you want to handle the download yourself.
   * @default true
   * @type {boolean}
   * @memberof LpdaDownloadMenuComponent
   * @example
   * <lpda-download-menu [downloadSelf]="false"></lpda-download-menu>
   * <lpda-download-menu downloadSelf="false"></lpda-download-menu>
   * <lpda-download-menu></lpda-download-menu>
   */
  @Input() downloadSelf?: boolean = true;

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
    this.download.subscribe(() => {
      if (this.downloadSelf) {
        this.downloadMenus();
      }
    })
  }

  ngAfterViewInit(): void {
    this.updateInputStatus();
    this.updateSelectedByAllMenusSelected();
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

  private updateSelectedByAllMenusSelected(): void {
    this.menuCards?.forEach((m: MenuCardComponent) => m.updateSelected(this.allMenusSelected));
    this.selectedChanged();
  }

  private downloadMenus(): void {
    this.updateSelectedByAllMenusSelected();
    DownloadFile.download(this.selected, {filename: this.filename || this.defaultFilename});
  }
}
