import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClarityModule } from '@clr/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { PhotoUploaderComponent } from './photo-uploader/photo-uploader.component';
import { FileUploadModule } from 'ng2-file-upload';
import { ProductCategorySelectorComponent } from './product-category-selector/product-category-selector.component';

const COMPONENTS = [PhotoUploaderComponent, ProductCategorySelectorComponent];

@NgModule({
  declarations: [...COMPONENTS],
  imports: [
    CommonModule,
    ClarityModule,
    NgSelectModule,
    FormsModule,
    ReactiveFormsModule,
    FileUploadModule,
  ],
  exports: [NgSelectModule, FormsModule, ReactiveFormsModule, ...COMPONENTS],
})
export class FormsComponentModule {}
