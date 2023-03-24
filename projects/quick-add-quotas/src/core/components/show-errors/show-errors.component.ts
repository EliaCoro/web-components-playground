import { ChangeDetectionStrategy, Component, HostBinding, Input, OnInit, SimpleChanges, TemplateRef } from '@angular/core';
import { ValidationErrors } from '@angular/forms';
import { ReactiveErrors } from '@lib/reactive-errors/reactive-errors';
import { QuickAddQuotasService } from '../../services/quick-add-quotas.service';
import { takeUntil } from 'rxjs/operators';
import { AutoDestroy } from '@lib/auto-destroy';
import { Subject } from 'rxjs';

@Component({
  selector: 'lib-show-errors',
  templateUrl: './show-errors.component.html',
  styleUrls: ['./show-errors.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShowErrorsComponent {

  @Input() errors?: ValidationErrors | null = null;

  @HostBinding('class.d-none') get hidden(): boolean {
    if (this.errors === null) return true;
    if (this.errors === undefined) return true;
    if (this.templates.length === 0 && this.strs.length === 0) return true;

    return this.visible === false;
  }

  @Input() visible: boolean = true;

  templates: TemplateRef<any>[] = [];

  strs: string[] = [];

  errorMessages?: Record<string, string>;

  @AutoDestroy private destroy$: Subject<void> = new Subject<void>();

  constructor(
    private readonly service: QuickAddQuotasService,
  ) {
    this.service.errorMessages$.pipe(
      takeUntil(this.destroy$),
    ).subscribe((messages) => {
      this.errorMessages = messages;
      this.recalculate();
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['errors']) this.recalculate();
  }

  private recalculate(): void {
    const errors = ReactiveErrors.formatErrors(this.errors || null, this.errorMessages);

    this.strs = [];
    this.templates = [];

    errors.forEach((s): void => {
      if (s && typeof s === 'string') {
        this.strs.push(s);
      } else if (s && s instanceof TemplateRef) {
        this.templates.push(s);
      }else{
        this.strs.push(JSON.stringify(s));
      }
    });
  }
}
