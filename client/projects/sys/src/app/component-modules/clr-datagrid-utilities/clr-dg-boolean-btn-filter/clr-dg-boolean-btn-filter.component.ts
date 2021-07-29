import { Component, Input, OnInit } from '@angular/core';
import { ClrCustomBtnFilter } from '../datagrid-filters';

@Component({
  selector: 'audi-sys-clr-dg-boolean-btn-filter',
  templateUrl: './clr-dg-boolean-btn-filter.component.html',
  styleUrls: ['./clr-dg-boolean-btn-filter.component.scss'],
})
export class ClrDgBooleanBtnFilterComponent implements OnInit {
  @Input()
  filter: ClrCustomBtnFilter;
  @Input()
  trueDisplayValue: string = '是 Yes';
  @Input()
  falseDisplayValue: string = '否 No';

  // HACK: boolean false value doesn't trigger clr state filter, use string instead
  booleanOptions = ['true', 'false', null];

  constructor() {}

  ngOnInit(): void {}
}
