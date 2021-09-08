import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslocoModule } from '@ngneat/transloco';
import { SliderModule } from '../../component-modules/slider/slider.module';
import { AngularFullpageModule } from '@fullpage/angular-fullpage';
import { FooterModule } from '../../core/footer/footer.module';
import { CardModule } from '../../component-modules/audi-ui/card/card.module';
import { SpinnerModule } from '../../component-modules/audi-ui/spinner/spinner.module';
import { IconModule } from '../../component-modules/audi-ui/icon/icon.module';
import { ButtonModule } from '../../component-modules/audi-ui/button/button.module';

const AUDI_MODULES = [
  CardModule,
  SpinnerModule,
  SliderModule,
  IconModule,
  ButtonModule,
];

import { HomeComponent } from './home/home.component';

@NgModule({
  declarations: [HomeComponent],
  imports: [
    CommonModule,
    TranslocoModule,
    AngularFullpageModule,
    FooterModule,
    ...AUDI_MODULES,
    RouterModule.forChild([
      {
        path: '',
        component: HomeComponent,
      },
    ]),
  ],
  exports: [HomeComponent],
})
export class HomeModule {}
