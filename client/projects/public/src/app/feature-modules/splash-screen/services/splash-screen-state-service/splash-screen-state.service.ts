import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { SplashScreenStateServiceModule } from './splash-screen-state.service.module';

@Injectable({
  providedIn: SplashScreenStateServiceModule,
})
export class SplashScreenStateService {
  _splashScreenIsOff$ = new Subject<boolean>();
  splashScreenIsOff$ = this._splashScreenIsOff$.asObservable();

  disableSplashScreen() {
    this._splashScreenIsOff$.next(true);
  }
}
