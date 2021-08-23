import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BreadcrumbItemComponent } from './breadcrumb-item/breadcrumb-item.component';
import { BreadcrumbComponent } from './breadcrumb.component';

const COMPONENTS = [BreadcrumbComponent, BreadcrumbItemComponent];
@NgModule({
  declarations: [...COMPONENTS],
  imports: [CommonModule],
  exports: [...COMPONENTS],
})
export class BreadcrumbModule {}
