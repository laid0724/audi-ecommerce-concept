import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminGuard, AuthGuard, LanguageSelectorResolver } from '@audi/data';
import { LoginComponent } from './core/login/login.component';
import { NavComponent } from './core/nav/nav.component';
import { NotFoundComponent } from './core/not-found/not-found.component';
import { ServerErrorComponent } from './core/server-error/server-error.component';

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
    // resolve: { data: LanguageSelectorResolver },
    // data: {
    //   languageSettings: DEFAULT_ZH_EN_ONLY,
    // },
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
        ],
      },
    ],
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
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
