import { HostListener, OnDestroy } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import {
  ActivatedRoute,
  Data,
  QueryParamsHandling,
  Router,
} from '@angular/router';
import {
  BusyService,
  DynamicDocument,
  DynamicDocumentParams,
  DynamicDocumentsService,
  DynamicDocumentType,
  Faq,
  formatClrDateToUTCString,
  LanguageCode,
  LanguageStateService,
  PaginatedResult,
  Pagination,
  setQueryParams,
  stringToBoolean,
} from '@audi/data';
import { ClrDatagridStateInterface } from '@clr/angular';
import { Subject } from 'rxjs';
import {
  distinctUntilChanged,
  filter,
  startWith,
  switchMap,
  take,
  takeUntil,
  tap,
} from 'rxjs/operators';
import {
  ClrCustomBtnFilter,
  ClrServerSideStringFilter,
} from '../../../component-modules/clr-datagrid-utilities/datagrid-filters';
import {
  DynamicDocumentData,
  DynamicDocumentDatagridColumn,
  DynamicDocumentSettings,
} from '../interfaces';

type DynamicDocumentWithoutFaq = Exclude<DynamicDocument, Faq>;

@Component({
  selector: 'audi-sys-dynamic-documents-list',
  templateUrl: './dynamic-documents-list.component.html',
  styleUrls: ['./dynamic-documents-list.component.scss'],
})
export class DynamicDocumentsListComponent implements OnInit, OnDestroy {
  @HostListener('document:keydown.escape', ['$event']) onEscapeHandler(
    event: KeyboardEvent
  ) {
    if (this.confirmDeleteModalOpen) {
      this.cancelDelete();
    }
  }

  @HostListener('document:keydown.enter', ['$event']) onEnterHandler(
    event: KeyboardEvent
  ) {
    if (this.confirmDeleteModalOpen && this.dynamicDocumentToDelete !== null) {
      this.onDelete(this.dynamicDocumentToDelete.id);
    }
  }

  paging: Pagination;

  initialQueryParams = {
    pageNumber: 1,
    pageSize: 10,
    title: undefined,
    type: undefined,
    isVisible: undefined,
    dateStart: undefined,
    dateEnd: undefined,
    // TODO createdAt start and end
  };

  dynamicDocumentParams: DynamicDocumentParams = this.initialQueryParams;

  titleFilter: ClrServerSideStringFilter = new ClrServerSideStringFilter(
    'title'
  );
  isVisibleFilter: ClrCustomBtnFilter = new ClrCustomBtnFilter('isVisible');
  // TODO: dateStart & dateEnd range filters

  datagridLoading = true;
  confirmDeleteModalOpen = false;

  dynamicDocuments: DynamicDocumentWithoutFaq[] = [];
  dynamicDocumentType: Exclude<DynamicDocumentType, 'faq'>;
  dynamicDocumentSettings: DynamicDocumentSettings;
  dynamicDocumentDatagridColumns: DynamicDocumentDatagridColumn[];
  dynamicDocumentToDelete: DynamicDocumentWithoutFaq | null = null;

  title: { zh: string; en: string };

  refresher$ = new Subject<DynamicDocumentParams>();
  destroy$ = new Subject<boolean>();

  constructor(
    private dynamicDocumentsService: DynamicDocumentsService,
    private languageService: LanguageStateService,
    private busyService: BusyService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    // this will restart component when hitting the same route,
    // this way refresher will fire again when we reset query params
    // e.g., when we switch language
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  ngOnInit(): void {
    this.languageService.language$
      .pipe(
        switchMap((lang: LanguageCode) =>
          this.route.data.pipe(
            distinctUntilChanged((prev: Data, curr: Data) => {
              const previous = prev as DynamicDocumentData;
              const current = curr as DynamicDocumentData;
              return (
                previous.dynamicDocumentSettings.type ===
                current.dynamicDocumentSettings.type
              );
            }),
            tap((data: Data) => {
              // FIXME: clear all datagrid filter values on the UI on language change
              this.dynamicDocumentParams = this.initialQueryParams;
              if (this.paging) {
                this.resetQueryParams();
              }
            }),
            filter((data: Data) => {
              const isValidType = this.isValidDynamicDocumentType(
                data.dynamicDocumentSettings.type
              );
              if (!isValidType) {
                console.error('dynamic document type does not exist!');
              }
              return isValidType;
            }),
            tap((data: Data) => {
              const dynamicDocumentData = data as DynamicDocumentData;
              const { dynamicDocumentSettings } = dynamicDocumentData;
              const { type, typeName, datagridColumns } =
                dynamicDocumentSettings;

              this.dynamicDocumentType = type as Exclude<
                DynamicDocumentType,
                'faq'
              >;
              this.dynamicDocumentSettings = dynamicDocumentSettings;
              this.dynamicDocumentDatagridColumns = datagridColumns;
              this.title = typeName;
            })
          )
        ),
        switchMap((_) =>
          this.refresher$.pipe(
            startWith(this.dynamicDocumentParams),
            switchMap((dynamicDocumentParams: DynamicDocumentParams) => {
              this.dynamicDocumentParams = {
                ...dynamicDocumentParams,
                type: this.dynamicDocumentType,
              };
              return this.dynamicDocumentsService[
                this.dynamicDocumentType
              ].getAll(this.dynamicDocumentParams);
            })
          )
        ),
        takeUntil(this.destroy$)
      )
      .subscribe((res: PaginatedResult<DynamicDocumentWithoutFaq[]>) => {
        this.dynamicDocuments = res.result;
        this.paging = res.pagination;
        this.datagridLoading = false;
        this.busyService.idle();
      });
  }

  public getValue(
    dynamicDocument: DynamicDocumentWithoutFaq,
    key: string
  ): any {
    // @ts-ignore
    const value = dynamicDocument[key];
    return value;
  }

  public asAny(value: any): any {
    return value as any;
  }

  isValidDynamicDocumentType(type: string): boolean {
    return Object.keys(this.dynamicDocumentsService).includes(type);
  }

  refreshDatagrid(state: ClrDatagridStateInterface): void {
    if (
      this.datagridLoading ||
      state == null ||
      Object.keys(state).length === 0
    ) {
      return;
    }

    this.dynamicDocumentParams = {
      ...this.dynamicDocumentParams,
      pageNumber: state.page?.current as number,
      pageSize: state.page?.size as number,
      title: undefined,
      type: undefined,
      isVisible: undefined,
      dateStart: undefined,
      dateEnd: undefined,
    };

    if (state.filters) {
      for (const filter of state.filters) {
        const { property, value } = <{ property: string; value: string }>filter;
        if (['title', 'type'].includes(property)) {
          this.dynamicDocumentParams = {
            ...this.dynamicDocumentParams,
            [property]: value,
          };
        }
        if (['isVisible'].includes(property)) {
          this.dynamicDocumentParams = {
            ...this.dynamicDocumentParams,
            [property]: stringToBoolean(value),
          };
        }
        if (['dateStart', 'dateEnd'].includes(property)) {
          this.dynamicDocumentParams = {
            ...this.dynamicDocumentParams,
            [property]: formatClrDateToUTCString(value),
          };
        }
      }
    }

    this.refresher$.next(this.dynamicDocumentParams);
  }

  promptDelete(dynamicDocument: DynamicDocumentWithoutFaq): void {
    this.dynamicDocumentToDelete = dynamicDocument;
    this.confirmDeleteModalOpen = true;
  }

  cancelDelete(): void {
    this.dynamicDocumentToDelete = null;
    this.confirmDeleteModalOpen = false;
  }

  onDelete(dynamicDocumentId: number): void {
    this.dynamicDocumentsService[this.dynamicDocumentType]
      .delete(dynamicDocumentId)
      .pipe(take(1))
      .subscribe(() => {
        this.dynamicDocumentToDelete = null;
        this.confirmDeleteModalOpen = false;
        this.refresher$.next(this.dynamicDocumentParams);
      });
  }

  resetQueryParams(queryParams = {}, queryParamsHandling = ''): void {
    this.paging.currentPage = 1;
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
