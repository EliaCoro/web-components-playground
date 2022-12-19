import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-lpda-download-menu-showcase',
  templateUrl: './lpda-download-menu-showcase.component.html',
  styleUrls: ['./lpda-download-menu-showcase.component.scss']
})
export class LpdaDownloadMenuShowcaseComponent {

  public data = [];

  constructor(
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.http.get('assets/lpda-download-menu-showcase/data.json').subscribe((data: any) => {
      this.data = data.data;
    });
  }

}
