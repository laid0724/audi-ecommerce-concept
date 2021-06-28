import { Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({
  providedIn: 'root',
})
export class BusyService {
  busyRequestCount = 0;

  constructor(private spinner: NgxSpinnerService) {}

  busy(): void {
    this.busyRequestCount++;
    /*
      for animations available:
        - list: https://labs.danielcardoso.net/load-awesome/animations.html
        - demo: https://napster2210.github.io/ngx-spinner/
    */
    this.spinner.show(undefined, {
      type: 'ball-clip-rotate',
      bdColor: 'rgba(0, 0, 0, 0.8)',
      color: '#fff',
    });
  }

  idle(): void {
    this.busyRequestCount--;
    if (this.busyRequestCount <= 0) {
      this.busyRequestCount = 0;
      this.spinner.hide();
    }
  }
}
