import { Component, Input, OnInit } from '@angular/core';
import { ClrCustomBtnFilter } from '../datagrid-filters';

@Component({
  selector: 'audi-sys-clr-dg-custom-btn-filter',
  templateUrl: './clr-dg-custom-btn-filter.component.html',
  styleUrls: ['./clr-dg-custom-btn-filter.component.scss'],
})
export class ClrDgCustomBtnFilterComponent implements OnInit {
  @Input()
  filter: ClrCustomBtnFilter;

  @Input()
  options: any[];

  constructor() {}

  ngOnInit(): void {}
}
