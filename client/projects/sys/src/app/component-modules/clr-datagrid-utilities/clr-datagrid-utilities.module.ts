import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClrDgServersideStringFilterComponent } from './clr-dg-serverside-string-filter/clr-dg-serverside-string-filter.component';
import { ClarityModule } from '@clr/angular';

const COMPONENTS = [ClrDgServersideStringFilterComponent];

@NgModule({
  declarations: [...COMPONENTS],
  imports: [CommonModule, ClarityModule],
  exports: [...COMPONENTS],
})
export class ClrDatagridUtilitiesModule {}
