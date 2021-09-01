import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MembersAreaContainerComponent } from './members-area-container/members-area-container.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: MembersAreaContainerComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MembersAreaRoutingModule {}
