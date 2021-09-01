import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MembersAreaRoutingModule } from './members-area-routing.module';
import { MembersAreaContainerComponent } from './members-area-container/members-area-container.component';

const COMPONENTS = [MembersAreaContainerComponent];

@NgModule({
  declarations: [...COMPONENTS],
  imports: [CommonModule, MembersAreaRoutingModule],
})
export class MembersAreaModule {}
