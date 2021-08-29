import { Component, OnDestroy, OnInit } from '@angular/core';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { HomepageService } from '@audi/data';
import { take } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'audi-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  homepageData$ = this.homepageService.getHomepage().pipe(take(1));

  fullpageConfig: any;
  fullpageRef: any;

  isDesktop: boolean;
  _breakpointObserverSubscription: Subscription;

  constructor(
    private homepageService: HomepageService,
    private breakpointObserver: BreakpointObserver,
    private router: Router
  ) {
    // this will restart component when hitting the same route,
    // this way component will reload when we change route params
    // e.g., when we switch language
    router.routeReuseStrategy.shouldReuseRoute = () => false;

    // for more details on config options please visit fullPage.js docs
    // see: https://github.com/alvarotrigo/fullPage.js
    this.fullpageConfig = {
      // fullpage options
      licenseKey: 'YOUR_KEY_HERE',
      verticalCentered: false,
      fitToSection: true,
      scrollOverflow: true,
      resetSlider: true,
      paddingTop: '56px', // account for header height
    };
  }

  ngOnInit(): void {
    this._breakpointObserverSubscription = this.breakpointObserver
      .observe(['(min-width: 640px)'])
      .subscribe((state: BreakpointState) => {
        this.isDesktop = state.matches;
      });
  }

  getFullpageRef(fullpageRef: any) {
    this.fullpageRef = fullpageRef;
  }

  ngOnDestroy(): void {
    if (this._breakpointObserverSubscription) {
      this._breakpointObserverSubscription.unsubscribe();
    }
  }
}
