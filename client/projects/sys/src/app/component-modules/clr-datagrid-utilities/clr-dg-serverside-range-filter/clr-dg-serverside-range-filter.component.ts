import { OnDestroy } from '@angular/core';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  clrDatagridRangeFilterValidator,
  NON_NEGATIVE_NUMBER_REGEX,
} from '@audi/data';
import { ClrForm } from '@clr/angular';
import { combineLatest, Subject } from 'rxjs';
import { startWith, takeUntil, tap } from 'rxjs/operators';
import { ClrMinMaxRangeFilter } from '../datagrid-filters';

@Component({
  selector: 'audi-sys-clr-dg-serverside-range-filter',
  templateUrl: './clr-dg-serverside-range-filter.component.html',
  styleUrls: ['./clr-dg-serverside-range-filter.component.scss'],
})
export class ClrDgServersideRangeFilterComponent implements OnInit, OnDestroy {
  @ViewChild(ClrForm, { static: false }) clrForm: ClrForm;

  @Input()
  minLabel = '至少 Min';
  @Input()
  maxLabel = '最多 Max';

  @Input()
  filter: ClrMinMaxRangeFilter;

  form: FormGroup;

  destroy$ = new Subject<boolean>();

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initForm();

    const minControl = this.form.get('min');
    const maxControl = this.form.get('max');

    if (minControl != null && maxControl != null) {
      combineLatest([
        minControl.valueChanges.pipe(startWith(null)),
        maxControl.valueChanges.pipe(startWith(null)),
      ])
        .pipe(
          tap(([min, max]: [number, number]) => {
            this.form.updateValueAndValidity({
              onlySelf: true,
              emitEvent: false,
            });

            if (this.form.valid) {
              this.filter.value[0] = min;
              this.filter.value[1] = max;
            } else {
              this.filter.value = [null, null];
            }

            this.filter.changes.next();
          }),
          takeUntil(this.destroy$)
        )
        .subscribe();
    }
  }

  initForm(): void {
    this.form = this.fb.group(
      {
        min: [null, [Validators.pattern(NON_NEGATIVE_NUMBER_REGEX)]],
        max: [null, [Validators.pattern(NON_NEGATIVE_NUMBER_REGEX)]],
      },
      { validators: clrDatagridRangeFilterValidator }
    );
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
