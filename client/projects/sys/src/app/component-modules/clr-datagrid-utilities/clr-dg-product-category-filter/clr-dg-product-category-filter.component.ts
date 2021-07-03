import { OnDestroy } from '@angular/core';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ClrForm } from '@clr/angular';
import { Subject } from 'rxjs';
import { startWith } from 'rxjs/operators';
import {
  ClrServerSideNumberFilter,
  ClrServerSideStringFilter,
} from '../datagrid-filters';

@Component({
  selector: 'audi-sys-clr-dg-product-category-filter',
  templateUrl: './clr-dg-product-category-filter.component.html',
  styleUrls: ['./clr-dg-product-category-filter.component.scss'],
})
export class ClrDgProductCategoryFilterComponent implements OnInit, OnDestroy {
  @ViewChild(ClrForm, { static: false }) clrForm: ClrForm;
  @Input()
  filter: ClrServerSideNumberFilter;

  form: FormGroup;

  destroy$ = new Subject<boolean>();

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      productCategoryId: [null],
    });

    const productCategoryId = this.form.get('productCategoryId');

    productCategoryId?.valueChanges
    .pipe(startWith(null))
      .subscribe((productId: string | null) => {
        this.filter.value = productId == null ? null : +productId;
        this.filter.changes.next()
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
