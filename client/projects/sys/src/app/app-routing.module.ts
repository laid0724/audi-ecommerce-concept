import { NgModule } from '@angular/core';
import { Validators } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { AdminGuard, AuthGuard, LanguageSelectorResolver } from '@audi/data';
import { LoginComponent } from './core/login/login.component';
import { NavComponent } from './core/nav/nav.component';
import { NotFoundComponent } from './core/not-found/not-found.component';
import { ServerErrorComponent } from './core/server-error/server-error.component';
import { DynamicDocumentsEditComponent } from './feature-modules/dynamic-documents/dynamic-documents-edit/dynamic-documents-edit.component';

const DEFAULT_ZH_EN_ONLY = {
  defaultLanguage: 'zh',
  availableLanguages: ['zh', 'en'],
};

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'login',
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'manage',
    component: NavComponent,
    runGuardsAndResolvers: 'always',
    canActivate: [AuthGuard, AdminGuard],
    canActivateChild: [AuthGuard, AdminGuard],
    children: [
      {
        path: '',
        children: [
          {
            path: '',
            pathMatch: 'full',
            redirectTo: 'home',
          },
          {
            path: 'home',
            loadChildren: () =>
              import('./feature-modules/home/home.module').then(
                (m) => m.HomeModule
              ),
          },
          {
            path: 'products',
            resolve: { data: LanguageSelectorResolver },
            data: {
              languageSettings: DEFAULT_ZH_EN_ONLY,
            },
            loadChildren: () =>
              import('./feature-modules/products/products.module').then(
                (m) => m.ProductsModule
              ),
          },
          {
            path: 'news',
            resolve: { data: LanguageSelectorResolver },
            data: {
              languageSettings: DEFAULT_ZH_EN_ONLY,
              dynamicDocumentSettings: {
                type: 'news',
                typeName: {
                  zh: '新聞',
                  en: 'News',
                },
                form: {
                  fields: [
                    {
                      key: 'title',
                      label: '標題 Title',
                      type: 'text',
                      validators: [Validators.required],
                    },
                    {
                      key: 'date',
                      label: '日期 Date',
                      type: 'date',
                    },
                    {
                      key: 'introduction',
                      label: '簡介 Introduction',
                      type: 'textarea',
                    },
                    {
                      key: 'wysiwyg',
                      label: '內容 Content',
                      type: 'wysiwyg',
                    },
                    {
                      key: 'isVisible',
                      label: '顯示狀態 Visibility',
                      type: 'toggle',
                    },
                  ],
                },
                hasFeaturedImage: true,
                saveOnly: false,
              },
            },
            loadChildren: () =>
              import(
                './feature-modules/dynamic-documents/dynamic-documents.module'
              ).then((m) => m.DynamicDocumentsModule),
          },
          {
            path: 'events',
            resolve: { data: LanguageSelectorResolver },
            data: {
              languageSettings: DEFAULT_ZH_EN_ONLY,
              dynamicDocumentSettings: {
                type: 'events',
                typeName: {
                  zh: '活動',
                  en: 'Event',
                },
                form: {
                  fields: [
                    {
                      key: 'title',
                      label: '標題 Title',
                      type: 'text',
                      validators: [Validators.required],
                    },
                    {
                      key: 'date',
                      label: '日期 Date',
                      type: 'date',
                    },
                    {
                      key: 'introduction',
                      label: '簡介 Introduction',
                      type: 'textarea',
                    },
                    {
                      key: 'wysiwyg',
                      label: '內容 Content',
                      type: 'wysiwyg',
                    },
                    {
                      key: 'isVisible',
                      label: '顯示狀態 Visibility',
                      type: 'toggle',
                    },
                  ],
                },
                hasFeaturedImage: true,
                saveOnly: false,
              },
            },
            loadChildren: () =>
              import(
                './feature-modules/dynamic-documents/dynamic-documents.module'
              ).then((m) => m.DynamicDocumentsModule),
          },
          {
            path: 'faq',
            resolve: { data: LanguageSelectorResolver },
            data: {
              languageSettings: DEFAULT_ZH_EN_ONLY,
              dynamicDocumentSettings: {
                type: 'faq',
                typeName: {
                  zh: '常見問題',
                  en: 'Faq',
                },
                form: {
                  fields: [
                    {
                      key: 'title',
                      label: '標題 Title',
                      type: 'text',
                      validators: [Validators.required],
                    },
                    {
                      key: 'introduction',
                      label: '簡介 Introduction',
                      type: 'textarea',
                    },
                    {
                      key: 'faqItems',
                      label: '問答列表 Faq Items',
                      type: 'faqitems',
                    },
                  ],
                },
                hasFeaturedImage: true,
                saveOnly: true,
              },
            },
            component: DynamicDocumentsEditComponent,
          },
          {
            path: 'not-found',
            component: NotFoundComponent,
          },
          {
            path: 'server-error',
            component: ServerErrorComponent,
          },
        ],
      },
    ],
  },
  {
    path: 'not-found',
    redirectTo: 'manage/not-found',
  },
  {
    path: 'server-error',
    redirectTo: 'manage/server-error',
  },
  {
    path: '**',
    redirectTo: 'manage/not-found',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
