import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductsRoutingModule } from './products-routing.module';
import { ProductsListComponent } from './products-list/products-list.component';
import { ProductsSingleComponent } from './products-single/products-single.component';

const COMPONENTS = [ProductsListComponent, ProductsSingleComponent];

@NgModule({
  declarations: [...COMPONENTS],
  imports: [CommonModule, ProductsRoutingModule],
  exports: [...COMPONENTS],
})
export class ProductsModule {}
