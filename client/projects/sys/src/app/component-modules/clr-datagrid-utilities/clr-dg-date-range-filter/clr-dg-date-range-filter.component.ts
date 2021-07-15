import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { clrDatagridDateRangeFilterValidator, DATE_REGEX } from '@audi/data';
import { ClrForm } from '@clr/angular';
import { Subject, combineLatest, interval } from 'rxjs';
import { debounce, startWith, takeUntil, tap } from 'rxjs/operators';
import { ClrDateRangeFilter } from '../datagrid-filters';

@Component({
  selector: 'audi-sys-clr-dg-date-range-filter',
  templateUrl: './clr-dg-date-range-filter.component.html',
  styleUrls: ['./clr-dg-date-range-filter.component.scss'],
})
export class ClrDgDateRangeFilterComponent implements OnInit, OnDestroy {
  @ViewChild(ClrForm, { static: false }) clrForm: ClrForm;

  @Input()
  dateStartLabel = '日期起 Start Date';
  @Input()
  dateEndLabel = '日期迄 End Date';

  @Input()
  filter: ClrDateRangeFilter;

  filterActive = false;

  form: FormGroup;

  destroy$ = new Subject<boolean>();

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initForm();

    const dateStartControl = this.form.get('dateStart');
    const dateEndControl = this.form.get('dateEnd');

    if (dateStartControl != null && dateEndControl != null) {
      combineLatest([
        dateStartControl.valueChanges.pipe(
          startWith(null),
          debounce(() => interval(300))
        ),
        dateEndControl.valueChanges.pipe(
          startWith(null),
          debounce(() => interval(300))
        ),
      ])
        .pipe(
          tap(([dateStart, dateEnd]: [string, string]) => {
            if (this.form.valid) {
              this.filter.value[0] = dateStart;
              this.filter.value[1] = dateEnd;

              this.filter.changes.next();

              this.form.updateValueAndValidity({
                onlySelf: true,
                emitEvent: false,
              });
            }
          }),
          takeUntil(this.destroy$)
        )
        .subscribe();
    }
  }

  initForm(): void {
    this.form = this.fb.group(
      {
        dateStart: [null, [Validators.pattern(DATE_REGEX)]],
        dateEnd: [null, [Validators.pattern(DATE_REGEX)]],
      },
      { validators: clrDatagridDateRangeFilterValidator }
    );
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
