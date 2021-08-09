import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomepageManagementComponent } from './homepage-management/homepage-management.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', component: HomepageManagementComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomepageManagementRoutingModule {}
