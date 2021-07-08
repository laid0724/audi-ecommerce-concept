import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductsRoutingModule } from './products-routing.module';
import { ClarityModule } from '@clr/angular';
import { ProductsCategoryListComponent } from './products-category-list/products-category-list.component';
import { ProductsEditComponent } from './products-edit/products-edit.component';
import { ProductsListComponent } from './products-list/products-list.component';
import { LanguageSelectorModule } from '../../component-modules/language-selector/language-selector.module';
import { FormsComponentModule } from '../../component-modules/forms-component/forms-component.module';
import { PipesModule } from '@audi/data';
import { ClrDatagridUtilitiesModule } from '../../component-modules/clr-datagrid-utilities/clr-datagrid-utilities.module';
import { ProductPhotoUploaderComponent } from './product-photo-uploader/product-photo-uploader.component';
import { FileUploadModule } from 'ng2-file-upload';
import { ProductVariantEditorComponent } from './product-variant-editor/product-variant-editor.component';

@NgModule({
  declarations: [
    ProductsCategoryListComponent,
    ProductsEditComponent,
    ProductsListComponent,
    ProductPhotoUploaderComponent,
    ProductVariantEditorComponent,
  ],
  imports: [
    CommonModule,
    ClarityModule,
    ProductsRoutingModule,
    LanguageSelectorModule,
    FormsComponentModule,
    PipesModule,
    ClrDatagridUtilitiesModule,
    FileUploadModule,
  ],
})
export class ProductsModule {}
