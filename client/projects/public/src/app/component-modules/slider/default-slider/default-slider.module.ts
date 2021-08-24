import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SwiperModule } from 'swiper/angular';
import { DefaultSliderComponent } from './default-slider.component';
import { AudiUiModule } from '../../audi-ui/audi-ui.module';
import { DirectivesModule } from '@audi/data';

const COMPONENTS = [DefaultSliderComponent];

@NgModule({
  declarations: [...COMPONENTS],
  imports: [CommonModule, SwiperModule, AudiUiModule, DirectivesModule],
  exports: [...COMPONENTS, DirectivesModule],
})
export class DefaultSliderModule {}
