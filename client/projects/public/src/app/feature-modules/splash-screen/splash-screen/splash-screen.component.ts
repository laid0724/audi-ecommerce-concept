import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { BusyService, LanguageStateService } from '@audi/data';
import { Subscription } from 'rxjs';
import { SplashScreenStateService } from '../services/splash-screen-state-service/splash-screen-state.service';

// for reference, see: https://javascript.plainenglish.io/creating-a-splash-screen-in-angular-for-loading-all-the-data-at-startup-b0b91d9d9f93

@Component({
  selector: 'audi-splash-screen',
  templateUrl: './splash-screen.component.html',
  styleUrls: ['./splash-screen.component.scss'],
})
export class SplashScreenComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('audiLandingVideo', { static: false })
  video: ElementRef<HTMLVideoElement>;

  showSplash: boolean = true;
  splashOpacity: number = 1;
  videoIsLoaded: boolean = false;
  videoIsPlaying: boolean = false;
  isMobile: boolean = false;
  isBusy: boolean = true;

  language$ = this.languageService._language$;

  _breakpointObserverSubscription: Subscription;
  _isBusySubscription: Subscription;

  constructor(
    private splashScreenStateService: SplashScreenStateService,
    private busyService: BusyService,
    private languageService: LanguageStateService,
    private renderer: Renderer2,
    private breakpointObserver: BreakpointObserver,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // just in case in some components you dont want splash screen to be triggered,
    // call service from that component on init.
    this.splashScreenStateService.splashScreenIsOff$.subscribe(
      (isOff: boolean) => {
        if (isOff) {
          this.hideSplashAnimation();
          this.ngOnDestroy();
        }
      }
    );

    this._breakpointObserverSubscription = this.breakpointObserver
      .observe(['(max-width: 800px)'])
      .subscribe((state: BreakpointState) => {
        this.isMobile = state.matches;
      });

    this._isBusySubscription = this.busyService.isBusy$.subscribe(
      (isBusy: boolean) => {
        this.isBusy = isBusy;
        this.detectVideoState();
      }
    );
  }

  ngAfterViewInit(): void {
    this.detectVideoState();
  }

  detectVideoState(): void {
    // detect changes is needed because of the ngIf on the video viewchild
    // see: https://stackoverflow.com/questions/55610047/angular6-viewchild-undefined-with-ngif
    this.cdr.detectChanges();

    if (!this.isMobile && !this.isBusy) {
      this.renderer.listen(
        this.video.nativeElement,
        'loadeddata',
        (e: Event) => {
          this.videoIsLoaded = true;
        }
      );

      this.renderer.listen(
        this.video.nativeElement,
        'onplaying',
        (e: Event) => {
          this.videoIsPlaying = true;
        }
      );
    }

    if (this.isMobile && !this.isBusy) {
      this.onSplashVideoEnded();
    }
  }

  hideSplashAnimation() {
    this.splashOpacity = 0;
    this.cdr.detectChanges();

    setTimeout(() => {
      this.showSplash = false;
    }, 1000);
  }

  onSplashVideoEnded(): void {
    this.splashScreenStateService.disableSplashScreen();
  }

  ngOnDestroy(): void {
    if (this._breakpointObserverSubscription) {
      this._breakpointObserverSubscription.unsubscribe();
    }
    if (this._isBusySubscription) {
      this._isBusySubscription.unsubscribe();
    }
  }
}
