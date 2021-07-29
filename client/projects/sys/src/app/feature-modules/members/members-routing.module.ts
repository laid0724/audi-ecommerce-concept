import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MembersListComponent } from './members-list/members-list.component';
import { MembersSingleComponent } from './members-single/members-single.component';

const routes: Routes = [
  {
    path: 'members',
    data: { userType: 'member' },
    component: MembersListComponent,
  },
  {
    path: 'members/:userId',
    data: { userType: 'member' },
    component: MembersSingleComponent,
  },
  {
    path: 'moderators',
    data: { userType: 'moderator' },
    component: MembersListComponent,
  },
  {
    path: 'moderators/:userId',
    data: { userType: 'moderator' },
    component: MembersSingleComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MembersRoutingModule {}
