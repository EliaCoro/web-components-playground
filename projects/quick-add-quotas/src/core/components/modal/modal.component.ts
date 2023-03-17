import { Component, EventEmitter, HostBinding, OnInit, Output } from '@angular/core';
import { QuickAddQuotasService } from '../../services/quick-add-quotas.service';
import { Question } from '@lib/question';
import { Subject, Subscription, merge } from 'rxjs';
import { AutoDestroy } from '@lib/auto-destroy';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'lib-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent {

  @Output("outsideClick") outsideClick: EventEmitter<any> = new EventEmitter<any>();

  @HostBinding('hidden') private hidden: boolean = true;

  @AutoDestroy destroy$: Subject<void> = new Subject<void>();

  constructor(
    private readonly service: QuickAddQuotasService
  ) {
    merge(
      this.service.sidChange,
      this.service.yiiCsrfTokenChange
    ).pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.service.tryGetInitialData();
    })
  }

  ngOnInit(): void {
    this.hidden = !this.service.showModal;

    this.service.showModalChange$.pipe(takeUntil(this.destroy$)).subscribe((show: boolean | undefined) => {
      this.hidden = show == undefined ? true : !show;
    });
  }

  ngAfterViewInit(): void {
    this.service.tryGetInitialData();
    document.body.classList.add("overflow-hidden");
  }

  hideModal(): void {
    this.service.setShowModal(false);
  }

  ngOnDestroy(): void {
    document.body.classList.remove("overflow-hidden");
  }
}
