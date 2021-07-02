import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClarityModule } from '@clr/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { FileUploadModule } from 'ng2-file-upload';
import { ProductCategorySelectorComponent } from './product-category-selector/product-category-selector.component';
import { QuillModule } from 'ngx-quill';
import { QuillEditorComponent } from './quill-editor/quill-editor.component';
import { WysiwygGridComponent } from './wysiwyg-grid/wysiwyg-grid.component';
import { DragDropModule } from '@angular/cdk/drag-drop';

const COMPONENTS = [
  ProductCategorySelectorComponent,
  QuillEditorComponent,
  WysiwygGridComponent,
];

@NgModule({
  declarations: [...COMPONENTS],
  imports: [
    CommonModule,
    ClarityModule,
    NgSelectModule,
    FormsModule,
    ReactiveFormsModule,
    FileUploadModule,
    QuillModule,
    DragDropModule,
  ],
  exports: [NgSelectModule, FormsModule, ReactiveFormsModule, ...COMPONENTS],
})
export class FormsComponentModule {}
