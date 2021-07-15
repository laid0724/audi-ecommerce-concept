import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DynamicDocumentsEditComponent } from './dynamic-documents-edit/dynamic-documents-edit.component';
import { DynamicDocumentsListComponent } from './dynamic-documents-list/dynamic-documents-list.component';

const routes: Routes = [
  {
    path: 'list',
    component: DynamicDocumentsListComponent,
  },
  {
    path: 'new',
    component: DynamicDocumentsEditComponent,
  },
  {
    path: ':dynamicDocumentId',
    component: DynamicDocumentsEditComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DynamicDocumentsRoutingModule {}
