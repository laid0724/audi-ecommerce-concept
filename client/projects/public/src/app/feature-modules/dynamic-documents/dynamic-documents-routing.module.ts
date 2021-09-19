import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundComponent } from '../../core/not-found/not-found.component';
import { DynamicDocumentsListComponent } from './dynamic-documents-list/dynamic-documents-list.component';
import { DynamicDocumentsSingleComponent } from './dynamic-documents-single/dynamic-documents-single.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'not-found',
  },
  {
    path: 'news',
    data: {
      documentType: 'news',
    },
    component: DynamicDocumentsListComponent,
  },
  {
    path: 'news/:documentId',
    data: {
      documentType: 'news',
    },
    component: DynamicDocumentsSingleComponent,
  },
  {
    path: 'events',
    data: {
      documentType: 'events',
    },
    component: DynamicDocumentsListComponent,
  },
  {
    path: 'events/:documentId',
    data: {
      documentType: 'events',
    },
    component: DynamicDocumentsSingleComponent,
  },
  {
    path: 'about',
    data: {
      documentType: 'about',
    },
    component: DynamicDocumentsSingleComponent,
  },
  {
    path: 'faq',
    data: {
      documentType: 'faq',
    },
    component: DynamicDocumentsSingleComponent,
  },
  {
    path: 'not-found',
    component: NotFoundComponent,
  },
  {
    path: '**',
    redirectTo: 'not-found',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DynamicDocumentsRoutingModule {}
