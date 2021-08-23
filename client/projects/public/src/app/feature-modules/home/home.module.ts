import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { RouterModule } from '@angular/router';
import { AudiUiModule } from '../../component-modules/audi-ui/audi-ui.module';
import { SliderModule } from '../../component-modules/slider/slider.module';

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
  ],
  exports: [HomeComponent],
})
export class HomeModule {}
