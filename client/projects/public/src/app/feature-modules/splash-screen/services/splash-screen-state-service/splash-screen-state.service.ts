import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SplashScreenStateService {
  _splashScreenIsOff$ = new BehaviorSubject<boolean>(false);
  splashScreenIsOff$ = this._splashScreenIsOff$.asObservable();

  disableSplashScreen() {
    this._splashScreenIsOff$.next(true);
  }
}
