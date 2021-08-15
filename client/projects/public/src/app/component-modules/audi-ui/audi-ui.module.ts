import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from './button/button.component';
import { ButtonGroupComponent } from './button-group/button-group.component';
import { IconComponent } from './icon/icon.component';
import { CardComponent } from './card/card.component';
import { ModalComponent } from './modal/modal.component';
import { CardGridComponent } from './card-grid/card-grid.component';
import { CardGridItemComponent } from './card-grid-item/card-grid-item.component';

const COMPONENTS = [
  ButtonComponent,
  ButtonGroupComponent,
  IconComponent,
  CardComponent,
  CardGridComponent,
  CardGridItemComponent,
  ModalComponent,
];

@NgModule({
  declarations: [...COMPONENTS],
  imports: [CommonModule],
  exports: [...COMPONENTS],
})
export class AudiUiModule {}
