import { isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  Order,
  BusyService,
  OrdersService,
  LanguageStateService,
} from '@audi/data';
import { Subject } from 'rxjs';

@Component({
  selector: 'audi-members-area-container',
  templateUrl: './members-area-container.component.html',
  styleUrls: ['./members-area-container.component.scss'],
})
export class MembersAreaContainerComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  @ViewChild('headerBg') headerBg: ElementRef<HTMLDivElement>;

  order: Order;

  loading = true;

  destroy$ = new Subject<boolean>();

  windowScrollListenerFn: () => void;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private renderer: Renderer2,
    private route: ActivatedRoute,
    private router: Router,
    private busyService: BusyService,
    private orderService: OrdersService,
    private languageService: LanguageStateService
  ) {}

  ngOnInit(): void {}

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
