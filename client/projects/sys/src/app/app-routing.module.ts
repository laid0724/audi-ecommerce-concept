import { NgModule } from '@angular/core';
import { Validators } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import {
  AdminGuard,
  AuthGuard,
  DATE_REGEX,
  LanguageSelectorResolver,
} from '@audi/data';
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
    path: 'confirm-email',
    data: {
      confirmEmail: true,
    },
    component: LoginComponent,
  },
  {
    path: 'reset-password',
    data: {
      resetPassword: true,
    },
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
            path: 'homepage',
            resolve: { data: LanguageSelectorResolver },
            data: {
              languageSettings: DEFAULT_ZH_EN_ONLY,
            },
            loadChildren: () =>
              import(
                './feature-modules/homepage-management/homepage-management.module'
              ).then((m) => m.HomepageManagementModule),
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
            path: 'orders',
            loadChildren: () =>
              import('./feature-modules/orders/orders.module').then(
                (m) => m.OrdersModule
              ),
          },
          {
            path: 'users',
            loadChildren: () =>
              import('./feature-modules/members/members.module').then(
                (m) => m.MembersModule
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
                  zh: '??????',
                  en: 'News',
                },
                datagridColumns: [
                  {
                    label: '?????? Title',
                    key: 'title',
                    type: 'string',
                    filter: 'title',
                  },
                  {
                    label: '???????????? Visibility',
                    key: 'isVisible',
                    type: 'isVisible',
                    filter: 'isVisible',
                  },
                  {
                    label: '?????? Date',
                    key: 'date',
                    type: 'date',
                    filter: 'date',
                  },
                  {
                    label: '???????????? Created At',
                    key: 'createdAt',
                    type: 'date',
                    filter: 'createdAt',
                  },
                  {
                    label: '???????????? Last Updated',
                    key: 'lastUpdated',
                    type: 'datetime',
                    filter: 'lastUpdated',
                  },
                ],
                form: {
                  fields: [
                    {
                      key: 'title',
                      label: '?????? Title',
                      type: 'text',
                      validators: [Validators.required],
                    },
                    {
                      key: 'date',
                      label: '?????? Date',
                      type: 'date',
                      validators: [
                        Validators.pattern(DATE_REGEX),
                        Validators.required,
                      ],
                    },
                    {
                      key: 'introduction',
                      label: '?????? Introduction',
                      type: 'textarea',
                    },
                    {
                      key: 'wysiwyg',
                      label: '?????? Content',
                      type: 'wysiwyg',
                    },
                    {
                      key: 'isVisible',
                      label: '???????????? Visibility',
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
                  zh: '??????',
                  en: 'Event',
                },
                datagridColumns: [
                  {
                    label: '?????? Title',
                    key: 'title',
                    type: 'string',
                    filter: 'title',
                  },
                  {
                    label: '???????????? Visibility',
                    key: 'isVisible',
                    type: 'isVisible',
                    filter: 'isVisible',
                  },
                  {
                    label: '?????? Date',
                    key: 'date',
                    type: 'date',
                    filter: 'date',
                  },
                  {
                    label: '???????????? Created At',
                    key: 'createdAt',
                    type: 'date',
                    filter: 'createdAt',
                  },
                  {
                    label: '???????????? Last Updated',
                    key: 'lastUpdated',
                    type: 'datetime',
                    filter: 'lastUpdated',
                  },
                ],
                form: {
                  fields: [
                    {
                      key: 'title',
                      label: '?????? Title',
                      type: 'text',
                      validators: [Validators.required],
                    },
                    {
                      key: 'date',
                      label: '?????? Date',
                      type: 'date',
                      validators: [
                        Validators.pattern(DATE_REGEX),
                        Validators.required,
                      ],
                    },
                    {
                      key: 'introduction',
                      label: '?????? Introduction',
                      type: 'textarea',
                    },
                    {
                      key: 'wysiwyg',
                      label: '?????? Content',
                      type: 'wysiwyg',
                    },
                    {
                      key: 'isVisible',
                      label: '???????????? Visibility',
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
                  zh: '????????????',
                  en: 'Faq',
                },
                form: {
                  fields: [
                    // {
                    //   key: 'title',
                    //   label: '?????? Title',
                    //   type: 'text',
                    //   validators: [Validators.required],
                    // },
                    {
                      key: 'introduction',
                      label: '?????? Introduction',
                      type: 'textarea',
                    },
                    {
                      key: 'faqItems',
                      label: '???????????? Faq Items',
                      type: 'faqitems',
                    },
                  ],
                },
                hasFeaturedImage: false,
                saveOnly: true,
              },
            },
            component: DynamicDocumentsEditComponent,
          },
          {
            path: 'about',
            resolve: { data: LanguageSelectorResolver },
            data: {
              languageSettings: DEFAULT_ZH_EN_ONLY,
              dynamicDocumentSettings: {
                type: 'about',
                typeName: {
                  zh: '?????? Audi',
                  en: 'About Audi',
                },
                form: {
                  fields: [
                    // {
                    //   key: 'title',
                    //   label: '?????? Title',
                    //   type: 'text',
                    //   validators: [Validators.required],
                    // },
                    {
                      key: 'introduction',
                      label: '?????? Introduction',
                      type: 'textarea',
                    },
                    {
                      key: 'wysiwyg',
                      label: '?????? Content',
                      type: 'wysiwyg',
                    },
                  ],
                },
                hasFeaturedImage: false,
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
