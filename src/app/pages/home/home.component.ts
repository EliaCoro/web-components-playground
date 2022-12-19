import { Component, OnInit } from '@angular/core';
import { Route, Router } from '@angular/router';

export interface MenuEntryData{
  title: string;
  path: string;
  faIcon?: string;
  matIcon?: string;
  imgSrc?: string;
}

export class MenuEntry{
  title: string;
  path: string;
  faIcon?: string;
  matIcon?: string;
  imgSrc?: string;

  constructor(
    data: MenuEntryData
  ){
    this.title = data.title;
    this.path = data.path;

    if (data.faIcon)  this.faIcon = data.faIcon;
    if (data.matIcon) this.matIcon = data.matIcon;
    if (data.imgSrc)  this.imgSrc = data.imgSrc;
  }
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  query: string = '';

  entries: MenuEntry[] = [];

  private missing: string[] = [];

  private readonly defaultEntries: MenuEntry[] = [];

  constructor(private router: Router) { }

  ngOnInit() {
    this.updateEntries();
  }

  private updateEntries(): void {
    this.missing = [];
    this.printpath('', this.router.config);

    var newItems: any = this.missing.map((s: string) => {
      return {
        title: s.replace('/', '').split('-').map((s: string) => s[0].toUpperCase() + s.substring(1)).join(' '),
        path: s.replace('/', '')
      };
    });

    this.entries = [
      ...this.defaultEntries,
      ...newItems
    ];
  }

  printpath(parent: String, config: Route[]) {
    for (let i = 0; i < config.length; i++) {
      const route = config[i];
      const path = `${parent}/${route.path}`;
      if (path && path.length > 1 && this.entries.filter((s: MenuEntry) => `/${s.path}` == path).length == 0 && path.replace('**', '').length > 1) {
        this.missing.push(path);
      }
      if (route.children) {
        const currentPath = route.path ? parent + '/' + route.path : parent;
        this.printpath(currentPath, route.children);
      }
    }
  }
}
