import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DynamicDocumentsRoutingModule } from './dynamic-documents-routing.module';
import { ClarityModule } from '@clr/angular';
import { LanguageSelectorModule } from '../../component-modules/language-selector/language-selector.module';
import { ClrDatagridUtilitiesModule } from '../../component-modules/clr-datagrid-utilities/clr-datagrid-utilities.module';
import { FileUploadModule } from 'ng2-file-upload';
import { FormsComponentModule } from '../../component-modules/forms-component/forms-component.module';
import { DynamicDocumentsListComponent } from './dynamic-documents-list/dynamic-documents-list.component';
import { DynamicDocumentsEditComponent } from './dynamic-documents-edit/dynamic-documents-edit.component';


@NgModule({
  declarations: [
    DynamicDocumentsListComponent,
    DynamicDocumentsEditComponent
  ],
  imports: [
    CommonModule,
    ClarityModule,
    DynamicDocumentsRoutingModule,
    LanguageSelectorModule,
    ClrDatagridUtilitiesModule,
    FileUploadModule,
    FormsComponentModule
  ]
})
export class DynamicDocumentsModule { }
