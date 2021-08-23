import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SplashScreenStateServiceModule } from './services/splash-screen-state-service/splash-screen-state.service.module';
import { SplashScreenComponent } from './splash-screen/splash-screen.component';
import { AudiUiModule } from '../../component-modules/audi-ui/audi-ui.module';

// for reference, see: https://javascript.plainenglish.io/creating-a-splash-screen-in-angular-for-loading-all-the-data-at-startup-b0b91d9d9f93

@NgModule({
  declarations: [
    SplashScreenComponent
  ],
  imports: [CommonModule, AudiUiModule, SplashScreenStateServiceModule],
  exports: [SplashScreenComponent, SplashScreenStateServiceModule],
})
export class SplashScreenModule {}
