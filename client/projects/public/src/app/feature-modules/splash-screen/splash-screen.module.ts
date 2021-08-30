import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AudiUiModule } from '../../component-modules/audi-ui/audi-ui.module';

import { SplashScreenComponent } from './splash-screen/splash-screen.component';
// for reference, see: https://javascript.plainenglish.io/creating-a-splash-screen-in-angular-for-loading-all-the-data-at-startup-b0b91d9d9f93

@NgModule({
  declarations: [
    SplashScreenComponent
  ],
  imports: [CommonModule, AudiUiModule],
  exports: [SplashScreenComponent],
})
export class SplashScreenModule {}
