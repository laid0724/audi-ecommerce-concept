import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DynamicDocumentsRoutingModule } from './dynamic-documents-routing.module';
import { DynamicDocumentsListComponent } from './dynamic-documents-list/dynamic-documents-list.component';
import { DynamicDocumentsSingleComponent } from './dynamic-documents-single/dynamic-documents-single.component';


@NgModule({
  declarations: [
    DynamicDocumentsListComponent,
    DynamicDocumentsSingleComponent
  ],
  imports: [
    CommonModule,
    DynamicDocumentsRoutingModule
  ]
})
export class DynamicDocumentsModule { }
