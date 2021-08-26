import { Component, OnDestroy, OnInit } from '@angular/core';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { HomepageService } from '@audi/data';
import { take } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'audi-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  homepageData$ = this.homepageService.getHomepage().pipe(take(1));

  isDesktop: boolean;
  _breakpointObserverSubscription: Subscription;

  constructor(
    private homepageService: HomepageService,
    private breakpointObserver: BreakpointObserver
  ) {}

  ngOnInit(): void {
    this._breakpointObserverSubscription = this.breakpointObserver
      .observe(['(min-width: 640px)'])
      .subscribe((state: BreakpointState) => {
        this.isDesktop = state.matches;
      });
  }

  ngOnDestroy(): void {
    if (this._breakpointObserverSubscription) {
      this._breakpointObserverSubscription.unsubscribe();
    }
  }
}
