import { Component, OnDestroy, OnInit } from '@angular/core';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import {
  DynamicDocumentsService,
  Event,
  Homepage,
  HomepageService,
  LanguageStateService,
  News,
  PaginatedResult,
  Product,
  ProductsService,
} from '@audi/data';
import { map, take } from 'rxjs/operators';
import { combineLatest, Observable, Subscription, forkJoin } from 'rxjs';
import { Router } from '@angular/router';

interface HomepageData {
  homepageData: Homepage;
  newestProducts: Product[];
  latestDocuments: (News | Event)[];
}

@Component({
  selector: 'audi-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  data$: Observable<HomepageData>;

  homepageData$: Observable<Homepage> = this.homepageService
    .getHomepage()
    .pipe(take(1));

  newestProducts$: Observable<Product[]> = this.productsService
    .getProducts({
      isVisible: true,
      pageNumber: 1,
      pageSize: 12,
    })
    .pipe(
      take(1),
      map((productsPaged: PaginatedResult<Product[]>) => productsPaged.result)
    );

  latestDocuments$: Observable<(News | Event)[]> = combineLatest([
    this.dynamicDocumentService.news.getAll({
      isVisible: true,
      pageNumber: 1,
      pageSize: 10,
    }),
    this.dynamicDocumentService.events.getAll({
      isVisible: true,
      pageNumber: 1,
      pageSize: 10,
    }),
  ]).pipe(
    take(1),
    map(
      ([newsPaged, eventsPaged]: [
        PaginatedResult<News[]>,
        PaginatedResult<Event[]>
      ]) => [newsPaged.result, eventsPaged.result] as [News[], Event[]]
    ),
    map(([news, events]: [News[], Event[]]) => {
      return [...news, ...events]
        .sort((a, b) => {
          // sort by descending createdAt date

          // need valueOf because typescript does not like arithmetic operations being used between Date objects.
          // see: https://stackoverflow.com/questions/36560806/the-left-hand-side-of-an-arithmetic-operation-must-be-of-type-any-number-or
          const dateA = new Date(a.createdAt).valueOf();
          const dateB = new Date(b.createdAt).valueOf();
          return dateB - dateA;
        })
        .slice(0, 9);
    })
  );

  language$ = this.languageService.language$;

  fullpageConfig: any;
  fullpageRef: any;

  isDesktop: boolean;
  _breakpointObserverSubscription: Subscription;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private router: Router,
    private languageService: LanguageStateService,
    private homepageService: HomepageService,
    private productsService: ProductsService,
    private dynamicDocumentService: DynamicDocumentsService
  ) {
    // this will restart component when hitting the same route,
    // this way component will reload when we change route params
    // e.g., when we switch language
    router.routeReuseStrategy.shouldReuseRoute = () => false;

    // for more details on config options please visit fullPage.js docs
    // see: https://github.com/alvarotrigo/fullPage.js
    this.fullpageConfig = {
      // fullpage options
      licenseKey: 'OPEN-SOURCE-GPLV3-LICENSE',
      verticalCentered: false,
      fitToSection: true,
      scrollOverflow: true,
      resetSlider: true,
      paddingTop: '56px', // fixed header height
    };
  }

  ngOnInit(): void {
    this._breakpointObserverSubscription = this.breakpointObserver
      .observe(['(min-width: 640px)'])
      .subscribe((state: BreakpointState) => {
        this.isDesktop = state.matches;
      });

    this.data$ = forkJoin({
      homepageData: this.homepageData$,
      newestProducts: this.newestProducts$,
      latestDocuments: this.latestDocuments$,
    }).pipe(take(1));
  }

  getFullpageRef(fullpageRef: any) {
    this.fullpageRef = fullpageRef;
  }

  ngOnDestroy(): void {
    if (this._breakpointObserverSubscription) {
      this._breakpointObserverSubscription.unsubscribe();
    }
    if (this.fullpageRef) {
      this.fullpageRef.destroy('all');
    }
  }
}
