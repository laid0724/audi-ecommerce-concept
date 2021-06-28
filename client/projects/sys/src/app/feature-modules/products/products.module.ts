import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductsRoutingModule } from './products-routing.module';
import { ClarityModule } from "@clr/angular";
import { ProductsCategoryListComponent } from './products-category-list/products-category-list.component';
import { ProductsEditComponent } from './products-edit/products-edit.component';
import { ProductsListComponent } from './products-list/products-list.component';

@NgModule({
  declarations: [
    ProductsCategoryListComponent,
    ProductsEditComponent,
    ProductsListComponent
  ],
  imports: [
    CommonModule,
    ClarityModule,
    ProductsRoutingModule
  ]
})
export class ProductsModule { }
