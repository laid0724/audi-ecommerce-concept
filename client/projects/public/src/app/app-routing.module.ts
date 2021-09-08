import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard, LanguageCode, MemberGuard } from '@audi/data';

import { LoginComponent } from './core/login/login.component';
import { NotFoundComponent } from './core/not-found/not-found.component';
import { ServerErrorComponent } from './core/server-error/server-error.component';

const lastSelectedLanguage =
  localStorage.getItem('language') !== null
    ? localStorage.getItem('language')
    : LanguageCode.Zh;

let routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: `${lastSelectedLanguage}/home`,
  },
  ...Object.keys(LanguageCode).map((key) => ({
    // @ts-ignore
    path: LanguageCode[key],
    // @ts-ignore
    redirectTo: `${LanguageCode[key]}/home`,
  })),
  {
    path: ':languageCode/home',
    loadChildren: () =>
      import('./feature-modules/home/home.module').then((m) => m.HomeModule),
  },
  {
    path: 'login',
    redirectTo: `${lastSelectedLanguage}/login`,
  },
  {
    path: ':languageCode/login',
    component: LoginComponent,
  },
  {
    path: 'confirm-email',
    redirectTo: `${lastSelectedLanguage}/confirm-email`,
  },
  {
    path: ':languageCode/confirm-email',
    data: {
      confirmEmail: true,
    },
    component: LoginComponent,
  },
  {
    path: 'reset-password',
    redirectTo: `${lastSelectedLanguage}/reset-password`,
  },
  {
    path: ':languageCode/reset-password',
    data: {
      resetPassword: true,
    },
    component: LoginComponent,
  },
  {
    path: ':languageCode/members-area',
    runGuardsAndResolvers: 'always',
    canActivate: [AuthGuard, MemberGuard],
    loadChildren: () =>
      import('./feature-modules/members-area/members-area.module').then(
        (m) => m.MembersAreaModule
      ),
  },
  {
    path: ':languageCode/products',
    loadChildren: () =>
      import('./feature-modules/products/products.module').then(
        (m) => m.ProductsModule
      ),
  },
  {
    path: ':languageCode/cart',
    loadChildren: () =>
      import('./feature-modules/cart/cart.module').then(
        (m) => m.CartModule
      ),
  },
  {
    path: 'server-error',
    redirectTo: `${lastSelectedLanguage}/server-error`,
  },
  {
    path: ':languageCode/server-error',
    component: ServerErrorComponent,
  },
  {
    path: 'not-found',
    redirectTo: `${lastSelectedLanguage}/not-found`,
  },
  {
    path: ':languageCode/not-found',
    component: NotFoundComponent,
  },
  {
    path: '**',
    /*
      not redirecting to 'not-found' directly because redirectTo can only be
      triggered once (no further redirects are evaluated after an absolute redirect)
      see: https://angular.io/api/router/Route
    */
    redirectTo: `${lastSelectedLanguage}/not-found`,
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled' }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
