import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClarityModule } from '@clr/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FileUploadModule } from 'ng2-file-upload';
import { ProductCategorySelectorComponent } from './product-category-selector/product-category-selector.component';
import { QuillModule } from 'ngx-quill';
import { QuillEditorComponent } from './quill-editor/quill-editor.component';
import { WysiwygGridComponent } from './wysiwyg-grid/wysiwyg-grid.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ProductSelectorComponent } from './product-selector/product-selector.component';
import { PipesModule } from '@audi/data';

const COMPONENTS = [
  ProductCategorySelectorComponent,
  QuillEditorComponent,
  WysiwygGridComponent,
  ProductSelectorComponent,
];

@NgModule({
  declarations: [...COMPONENTS],
  imports: [
    CommonModule,
    ClarityModule,
    FormsModule,
    ReactiveFormsModule,
    FileUploadModule,
    QuillModule,
    DragDropModule,
    PipesModule,
  ],
  exports: [FormsModule, ReactiveFormsModule, ...COMPONENTS],
})
export class FormComponentsModule {}
