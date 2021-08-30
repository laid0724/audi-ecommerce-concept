import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LanguageCode } from '@audi/data';

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
    path: ':languageCode/login',
    component: LoginComponent,
  },
  {
    path: 'not-found',
    component: NotFoundComponent,
  },
  {
    path: 'server-error',
    component: ServerErrorComponent,
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
