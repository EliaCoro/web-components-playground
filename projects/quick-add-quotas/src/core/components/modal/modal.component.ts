import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'lib-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit {

  @Output("outsideClick") outsideClick: EventEmitter<any> = new EventEmitter<any>();

  constructor() { }

  ngOnInit(): void {
  }

}
