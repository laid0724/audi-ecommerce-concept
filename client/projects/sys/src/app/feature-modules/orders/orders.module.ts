import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrdersRoutingModule } from './orders-routing.module';
import { OrdersSingleComponent } from './orders-single/orders-single.component';
import { OrdersListComponent } from './orders-list/orders-list.component';
import { ClarityModule } from '@clr/angular';
import { FormComponentsModule } from '../../component-modules/form-components/form-components.module';
import { PipesModule } from '@audi/data';
import { ClrDatagridUtilitiesModule } from '../../component-modules/clr-datagrid-utilities/clr-datagrid-utilities.module';

@NgModule({
  declarations: [OrdersSingleComponent, OrdersListComponent],
  imports: [
    CommonModule,
    ClarityModule,
    OrdersRoutingModule,
    FormComponentsModule,
    PipesModule,
    ClrDatagridUtilitiesModule,
  ],
})
export class OrdersModule {}
