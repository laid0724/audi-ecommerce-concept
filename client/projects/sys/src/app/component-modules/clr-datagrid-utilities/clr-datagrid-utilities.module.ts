import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClrDgServersideStringFilterComponent } from './clr-dg-serverside-string-filter/clr-dg-serverside-string-filter.component';
import { ClarityModule } from '@clr/angular';
import { ClrDgCustomBtnFilterComponent } from './clr-dg-custom-btn-filter/clr-dg-custom-btn-filter.component';
import { ClrDgServersideRangeFilterComponent } from './clr-dg-serverside-range-filter/clr-dg-serverside-range-filter.component';
import { ClrDgProductCategoryFilterComponent } from './clr-dg-product-category-filter/clr-dg-product-category-filter.component';
import { FormsComponentModule } from '../forms-component/forms-component.module';

const COMPONENTS = [
  ClrDgServersideStringFilterComponent,
  ClrDgCustomBtnFilterComponent,
  ClrDgServersideRangeFilterComponent,
  ClrDgProductCategoryFilterComponent,
];

@NgModule({
  declarations: [...COMPONENTS],
  imports: [CommonModule, ClarityModule, FormsComponentModule],
  exports: [...COMPONENTS],
})
export class ClrDatagridUtilitiesModule {}
