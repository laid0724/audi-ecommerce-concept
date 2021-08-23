import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClrDgServersideStringFilterComponent } from './clr-dg-serverside-string-filter/clr-dg-serverside-string-filter.component';
import { ClarityModule } from '@clr/angular';
import { ClrDgBooleanBtnFilterComponent } from './clr-dg-boolean-btn-filter/clr-dg-boolean-btn-filter.component';
import { ClrDgServersideRangeFilterComponent } from './clr-dg-serverside-range-filter/clr-dg-serverside-range-filter.component';
import { ClrDgProductCategoryFilterComponent } from './clr-dg-product-category-filter/clr-dg-product-category-filter.component';
import { FormComponentsModule } from '../form-components/form-components.module';
import { ClrDgDateRangeFilterComponent } from './clr-dg-date-range-filter/clr-dg-date-range-filter.component';
import { ClrDgCustomBtnFilterComponent } from './clr-dg-custom-btn-filter/clr-dg-custom-btn-filter.component';

const COMPONENTS = [
  ClrDgServersideStringFilterComponent,
  ClrDgBooleanBtnFilterComponent,
  ClrDgCustomBtnFilterComponent,
  ClrDgServersideRangeFilterComponent,
  ClrDgProductCategoryFilterComponent,
  ClrDgDateRangeFilterComponent,
];

@NgModule({
  declarations: [...COMPONENTS],
  imports: [CommonModule, ClarityModule, FormComponentsModule],
  exports: [...COMPONENTS],
})
export class ClrDatagridUtilitiesModule {}
