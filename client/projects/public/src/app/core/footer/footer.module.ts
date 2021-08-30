import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from '../../component-modules/audi-ui/button/button.module';
import { FormComponentsModule } from '../../component-modules/form-components/form-components.module';
import { TranslocoModule } from '@ngneat/transloco';
import { RouterModule } from '@angular/router';
import { IconModule } from '../../component-modules/audi-ui/icon/icon.module';

import { FooterComponent } from './footer.component';

const COMPONENTS = [FooterComponent];

@NgModule({
  declarations: [...COMPONENTS],
  imports: [
    CommonModule,
    FormComponentsModule,
    ButtonModule,
    TranslocoModule,
    RouterModule,
    IconModule,
  ],
  exports: [...COMPONENTS],
})
export class FooterModule {}
