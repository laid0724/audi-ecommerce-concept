import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrderGuard } from './guards/order.guard';
import { MembersAreaContainerComponent } from './members-area-container/members-area-container.component';
import { MembersOrderSingleComponent } from './members-order-single/members-order-single.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'personal-info',
  },
  {
    path: 'personal-info',
    data: {
      activeTab: 'personal-info',
    },
    component: MembersAreaContainerComponent,
  },
  {
    path: 'liked-products',
    data: {
      activeTab: 'liked-products',
    },
    component: MembersAreaContainerComponent,
  },
  {
    path: 'orders',
    data: {
      activeTab: 'orders',
    },
    component: MembersAreaContainerComponent,
  },
  {
    path: 'orders/:orderId',
    runGuardsAndResolvers: 'always',
    canActivate: [OrderGuard],
    component: MembersOrderSingleComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MembersAreaRoutingModule {}
