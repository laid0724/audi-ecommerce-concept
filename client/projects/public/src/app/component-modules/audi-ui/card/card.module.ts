import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent } from './card/card.component';
import { CardGridItemComponent } from './card-grid-item/card-grid-item.component';
import { CardGridComponent } from './card-grid/card-grid.component';

const COMPONENTS = [CardComponent, CardGridItemComponent, CardGridComponent];

@NgModule({
  declarations: [...COMPONENTS],
  imports: [CommonModule],
  exports: [...COMPONENTS],
})
export class CardModule {}
