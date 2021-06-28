import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductsRoutingModule } from './products-routing.module';
import { ClarityModule } from "@clr/angular";
import { ProductsCategoryListComponent } from './products-category-list/products-category-list.component';
import { ProductsEditComponent } from './products-edit/products-edit.component';
import { ProductsListComponent } from './products-list/products-list.component';
import { LanguageSelectorModule } from "../../component-modules/language-selector/language-selector.module";
import { FormsComponentModule } from "../../component-modules/forms-component/forms-component.module";

@NgModule({
  declarations: [
    ProductsCategoryListComponent,
    ProductsEditComponent,
    ProductsListComponent
  ],
  imports: [
    CommonModule,
    ClarityModule,
    ProductsRoutingModule,
    LanguageSelectorModule,
    FormsComponentModule
  ]
})
export class ProductsModule { }
