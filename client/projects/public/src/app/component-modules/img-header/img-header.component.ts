import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

/*
  USAGE

  <audi-img-header
    [title]="'lol'"
    [subTitle]="'lol'"
    [resultCount]="pagination.totalItems"
    desktopBgImageUrl="/assets/images/product-list-default-bg-desktop.jpg"
    mobileBgImageUrl="/assets/images/product-list-default-bg-mobile.jpg"
  ></audi-img-header>
*/

@Component({
  selector: 'audi-img-header',
  templateUrl: './img-header.component.html',
  styleUrls: ['./img-header.component.scss'],
})
export class ImgHeaderComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('headerBg') headerBg: ElementRef<HTMLDivElement>;

  @Input() title: string | undefined;
  @Input() subTitle: string | undefined;
  @Input() resultCount: number | undefined;
  @Input() resultLabel: string | undefined;
  @Input() desktopBgImageUrl: string;
  @Input() mobileBgImageUrl: string;

  isDesktop: boolean;

  destroy$ = new Subject<boolean>();

  windowScrollListenerFn: () => void;
  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private breakpointObserver: BreakpointObserver,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    this.breakpointObserver
      .observe(['(min-width: 640px)'])
      .pipe(takeUntil(this.destroy$))
      .subscribe((state: BreakpointState) => {
        this.isDesktop = state.matches;
      });
  }
  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      /*
        using background-attachment: fixed ALONG with background-size: cover
        makes the background bg size all messed up.

        this is a workaround to that issue, mimicking parallax effect.

        see: https://stackoverflow.com/questions/21786272/css-background-size-cover-background-attachment-fixed-clipping-background-im
      */

      this.windowScrollListenerFn = this.renderer.listen(
        window,
        'scroll',
        (event: any) => {
          // see: see: https://stackoverflow.com/questions/28050548/window-pageyoffset-is-always-0-with-overflow-x-hidden
          const scrollTop = event.srcElement.scrollingElement.scrollTop;

          this.renderer.setStyle(
            this.headerBg.nativeElement,
            'transform',
            `translateY(${scrollTop}px)`
          );
        }
      );
    }
  }

  ngOnDestroy(): void {
    if (isPlatformBrowser(this.platformId) && this.windowScrollListenerFn) {
      this.windowScrollListenerFn();
    }

    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
