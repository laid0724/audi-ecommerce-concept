import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {
  ActivatedRoute,
  Data,
  ParamMap,
  QueryParamsHandling,
  Router,
} from '@angular/router';
import {
  BusyService,
  clrDatagridDateRangeFilterValidator,
  DATE_REGEX,
  DynamicDocumentParams,
  DynamicDocumentSort,
  DynamicDocumentsService,
  DynamicDocumentType,
  Event,
  News,
  PaginatedResult,
  Pagination,
  setQueryParams,
} from '@audi/data';
import { Subject } from 'rxjs';
import { startWith, switchMap, takeUntil, tap } from 'rxjs/operators';

@Component({
  selector: 'audi-dynamic-documents-list',
  templateUrl: './dynamic-documents-list.component.html',
  styleUrls: ['./dynamic-documents-list.component.scss'],
})
export class DynamicDocumentsListComponent implements OnInit, OnDestroy {
  dynamicDocuments: Event[] | News[] = [];
  dynamicDocumentType: Exclude<DynamicDocumentType, 'about' | 'faq'>;

  filterForm: FormGroup;
  filterModalIsOpen: boolean = false;

  dynamicDocumentSortEnum: typeof DynamicDocumentSort = DynamicDocumentSort;

  dynamicDocumentParams: DynamicDocumentParams = {
    pageSize: 10,
    pageNumber: 1,
  };

  pagination: Pagination;
  isParamsEmpty: boolean = true;

  loading = true;

  isDesktop: boolean;

  refresher$ = new Subject<DynamicDocumentParams>();
  destroy$ = new Subject<boolean>();

  get imgHeaderBgImageUrl(): string {
    return `/assets/images/${this.dynamicDocumentType}-bg.jpg`;
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private breakpointObserver: BreakpointObserver,
    private dynamicDocumentsService: DynamicDocumentsService,
    private busyService: BusyService
  ) {}

  ngOnInit(): void {
    this.initFilterForm();

    this.breakpointObserver
      .observe(['(min-width: 640px)'])
      .pipe(takeUntil(this.destroy$))
      .subscribe((state: BreakpointState) => {
        this.isDesktop = state.matches;
      });

    this.route.data
      .pipe(
        switchMap((data: Data) => {
          this.dynamicDocumentType = data.documentType;

          return this.route.queryParamMap.pipe(
            tap((qp: ParamMap) => {
              const dynamicDocumentParamKeys = [
                'pageNumber',
                'title',
                'dateStart',
                'dateEnd',
              ];

              this.isParamsEmpty = true;

              dynamicDocumentParamKeys.forEach((param: string) => {
                if (qp.has(param)) {
                  this.dynamicDocumentParams = {
                    ...this.dynamicDocumentParams,
                    [param]: qp.get(param),
                  };

                  if (
                    this.isParamsEmpty &&
                    param !== 'sort' &&
                    param !== 'pageNumber'
                  ) {
                    this.isParamsEmpty = false;
                  }
                }
              });

              this.filterForm.patchValue(this.dynamicDocumentParams);
            })
          );
        }),
        switchMap((_) =>
          this.refresher$.pipe(
            startWith(this.dynamicDocumentParams),
            switchMap((dynamicDocumentParams: DynamicDocumentParams) =>
              this.dynamicDocumentsService[
                this.dynamicDocumentType
              ].getAllIsVisible(this.dynamicDocumentParams)
            ),
            takeUntil(this.destroy$)
          )
        )
      )
      .subscribe((dynamicDocumentsPaged: PaginatedResult<Event[] | News[]>) => {
        this.dynamicDocuments = dynamicDocumentsPaged.result;
        this.pagination = dynamicDocumentsPaged.pagination;

        this.loading = false;
        this.busyService.idle();
      });
  }

  initFilterForm(): void {
    this.filterForm = this.fb.group(
      {
        title: [undefined],
        dateStart: [undefined, [Validators.pattern(DATE_REGEX)]],
        dateEnd: [undefined, [Validators.pattern(DATE_REGEX)]],
      },
      { validators: clrDatagridDateRangeFilterValidator }
    );
  }

  onSubmitFilter(): void {
    if (this.filterForm.invalid) {
      this.filterForm.markAllAsTouched();
      return;
    }

    // reset previous params
    this.dynamicDocumentParams = {
      ...this.dynamicDocumentParams,
      pageNumber: 1,
      title: undefined,
      dateStart: undefined,
      dateEnd: undefined,
    };

    const filterValues: Partial<DynamicDocumentParams> = Object.keys(
      this.filterForm.value
    )
      .filter((key) => !!this.filterForm.value[key])
      .map((key) => ({ [key]: this.filterForm.value[key] }))
      .reduce(
        (
          obj: Partial<DynamicDocumentParams>,
          param: { [key: string]: any }
        ) => ({
          ...obj,
          ...param,
        }),
        {}
      );

    this.dynamicDocumentParams = {
      ...this.dynamicDocumentParams,
      ...filterValues,
    };

    this.filterModalIsOpen = false;

    // HACK
    /*
      Angular's router navigate event will trigger onDestroy on all the components that
      are on this component's template if you navigate to the same page via router.navigate([]).
      So, when I set the query parameter while the modal is open,
      the modal's onDestroy event will remove the modal from modal service,
      causing the component to lose id reference to the DOM element.

      The modal then breaks and then you cannot close it.

      this seems to be the only article that i can find on the issue,
      which has to do with messing with the routing strategies.
      see: https://stackoverflow.com/questions/41280471/how-to-implement-routereusestrategy-shoulddetach-for-specific-routes-in-angular/41515648#41515648

      Too complex, dont have time for now.

      right now, use set timeout to hard push the router navigate event to the back of the
      event loop, allowing the modal to close first.

      FIXME: REVISIT LATER
    */
    setTimeout(() => {
      this.setQueryParams(this.dynamicDocumentParams);
    }, 0);
  }

  onResetFilters(): void {
    this.dynamicDocumentParams = {
      pageSize: 10,
      pageNumber: 1,
    };

    this.filterForm.reset();

    if (!this.isDesktop) {
      this.filterModalIsOpen = false;
    }

    setTimeout(() => {
      this.setQueryParams();
    }, 0);
  }

  onPageChange(page: number): void {
    this.dynamicDocumentParams = {
      ...this.dynamicDocumentParams,
      pageNumber: page,
    };

    this.setQueryParams(this.dynamicDocumentParams);
  }

  onSortDynamicDocument(sort: DynamicDocumentSort): void {
    this.dynamicDocumentParams = {
      ...this.dynamicDocumentParams,
      sort,
      pageNumber: 1,
    };

    this.setQueryParams(this.dynamicDocumentParams);
  }

  setQueryParams(queryParams = {}, queryParamsHandling = ''): void {
    setQueryParams(
      this.router,
      this.route,
      queryParams,
      queryParamsHandling as QueryParamsHandling
    );
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
