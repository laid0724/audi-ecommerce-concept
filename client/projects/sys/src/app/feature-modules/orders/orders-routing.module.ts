import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrdersListComponent } from './orders-list/orders-list.component';
import { OrdersSingleComponent } from './orders-single/orders-single.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: OrdersListComponent,
  },
  {
    path: ':orderId',
    component: OrdersSingleComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrdersRoutingModule {}
