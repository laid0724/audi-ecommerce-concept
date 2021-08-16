import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from './button/button.component';
import { ButtonGroupComponent } from './button-group/button-group.component';
import { IconComponent } from './icon/icon.component';
import { CardComponent } from './card/card.component';
import { ModalComponent } from './modal/modal.component';
import { CardGridComponent } from './card-grid/card-grid.component';
import { CardGridItemComponent } from './card-grid-item/card-grid-item.component';
import { ModalService } from './services/modal.service';
import { PopoverComponent } from './popover/popover.component';
import { PopoverService } from './services/popover.service';

const COMPONENTS = [
  ButtonComponent,
  ButtonGroupComponent,
  IconComponent,
  CardComponent,
  CardGridComponent,
  CardGridItemComponent,
  ModalComponent,
  PopoverComponent,
];

const PROVIDERS = [ModalService, PopoverService];

@NgModule({
  declarations: [...COMPONENTS],
  providers: [...PROVIDERS],
  imports: [CommonModule],
  exports: [...COMPONENTS],
})
export class AudiUiModule {}
