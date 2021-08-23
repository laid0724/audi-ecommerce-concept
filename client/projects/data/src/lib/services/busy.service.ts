import { Injectable, Optional } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BusyService {
  busyRequestCount = 0;

  _isBusy$ = new BehaviorSubject(false);
  isBusy$ = this._isBusy$.asObservable();

  constructor(@Optional() private spinner: NgxSpinnerService) {}

  busy(): void {
    this.busyRequestCount++;

    this._isBusy$.next(true);

    /*
      for animations available:
        - list: https://labs.danielcardoso.net/load-awesome/animations.html
        - demo: https://napster2210.github.io/ngx-spinner/
    */
    this.spinner?.show(undefined, {
      type: 'ball-clip-rotate',
      bdColor: 'rgba(0, 0, 0, 0.8)',
      color: '#fff',
    });
  }

  idle(): void {
    this.busyRequestCount--;
    if (this.busyRequestCount <= 0) {
      this.busyRequestCount = 0;

      this._isBusy$.next(false);

      this.spinner?.hide();
    }
  }
}
