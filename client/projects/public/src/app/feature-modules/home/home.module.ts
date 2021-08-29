import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslocoModule } from '@ngneat/transloco';
import { AudiUiModule } from '../../component-modules/audi-ui/audi-ui.module';
import { SliderModule } from '../../component-modules/slider/slider.module';
import { AngularFullpageModule } from '@fullpage/angular-fullpage';
import { FooterModule } from '../../core/footer/footer.module';

import { HomeComponent } from './home/home.component';

@NgModule({
  declarations: [HomeComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: HomeComponent,
      },
    ]),
    AudiUiModule,
    SliderModule,
    TranslocoModule,
    AngularFullpageModule,
    FooterModule,
  ],
  exports: [HomeComponent],
})
export class HomeModule {}
