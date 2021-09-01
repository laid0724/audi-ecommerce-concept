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
    pathMatch: 'full',
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
    redirectTo: 'not-found',
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled' }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
