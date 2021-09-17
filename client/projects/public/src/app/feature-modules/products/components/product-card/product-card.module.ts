import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconModule } from 'projects/public/src/app/component-modules/audi-ui/icon/icon.module';
import { CardModule } from 'projects/public/src/app/component-modules/audi-ui/card/card.module';
import { RouterModule } from '@angular/router';
import { TranslocoModule } from '@ngneat/transloco';

import { ProductCardComponent } from './product-card.component';

const IMPORT_MODULES = [IconModule, CardModule, RouterModule, TranslocoModule];

@NgModule({
  declarations: [ProductCardComponent],
  imports: [CommonModule, ...IMPORT_MODULES],
  exports: [ProductCardComponent],
})
export class ProductCardModule {}
