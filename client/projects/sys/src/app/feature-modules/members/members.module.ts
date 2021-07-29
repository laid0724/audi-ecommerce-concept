import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MembersRoutingModule } from './members-routing.module';
import { ClarityModule } from '@clr/angular';
import { PipesModule } from '@audi/data';
import { ClrDatagridUtilitiesModule } from '../../component-modules/clr-datagrid-utilities/clr-datagrid-utilities.module';
import { FormsComponentModule } from '../../component-modules/forms-component/forms-component.module';
import { MembersListComponent } from './members-list/members-list.component';
import { MembersSingleComponent } from './members-single/members-single.component';

@NgModule({
  declarations: [
    MembersListComponent,
    MembersSingleComponent
  ],
  imports: [
    CommonModule,
    ClarityModule,
    MembersRoutingModule,
    FormsComponentModule,
    PipesModule,
    ClrDatagridUtilitiesModule,
  ],
})
export class MembersModule {}
