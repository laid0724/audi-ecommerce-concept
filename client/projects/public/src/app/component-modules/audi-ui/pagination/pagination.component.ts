import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  OnDestroy,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import {
  AudiComponents,
  AudiModuleName,
  initAudiModules,
  Pagination,
} from '@audi/data';
import { AudiPaginationType } from '../enums';
import { Subscription } from 'rxjs';

/*
  USAGE

  <audi-pagination
    [type]="'desktop'"
    [pagination]="{
      currentPage: 1,
      itemsPerPage: 10,
      totalItems: 100,
      totalPages: 10
    }"
    (pageChange)="PAGE_CHANGE_OUTPUT"
  >
  </audi-pagination>

*/

@Component({
  selector: 'audi-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss'],
})
export class PaginationComponent implements OnInit, OnChanges, AfterViewInit, OnDestroy {
  @Input() isLightTheme: boolean = false;
  @Input() type: AudiPaginationType | string = AudiPaginationType.Desktop;
  @Input() pagination: Pagination;
  @Input() pageRange: number = 1;

  @Output()
  pageChange = new EventEmitter<number>();

  audiPaginationJsComponents: any[];

  _breakpointObserverSubscription: Subscription;

  constructor(private breakpointObserver: BreakpointObserver) {}

  ngOnInit(): void {
    this._breakpointObserverSubscription = this.breakpointObserver
      .observe(['(min-width: 768px)'])
      .subscribe((state: BreakpointState) => {
        const isDesktop = state.matches;

        if (this.type === AudiPaginationType.Desktop && !isDesktop) {
          this.type = AudiPaginationType.Mobile;
        }

        if (this.type === AudiPaginationType.Mobile && isDesktop) {
          this.type = AudiPaginationType.Desktop;
        }

        if (
          this.audiPaginationJsComponents != undefined &&
          Array.isArray(this.audiPaginationJsComponents) &&
          this.audiPaginationJsComponents.length > 0
        ) {
          this.updatePaginationJsActiveIndicator();
        }
      });
  }

  ngAfterViewInit(): void {
    const audiPaginationModules = initAudiModules(AudiModuleName.Pagination);

    audiPaginationModules.forEach((paginationModule: AudiComponents) => {
      this.audiPaginationJsComponents =
        paginationModule.components.upgradeElements();

      this.updatePaginationJsActiveIndicator();
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.updatePaginationJsActiveIndicator();
  }

  onPageChange(page: number): void {
    if (this.pagination.currentPage !== page) {
      // this.pagination.currentPage = page;
      this.pageChange.emit(page);

      this.updatePaginationJsActiveIndicator();
    }
  }

  updatePaginationJsActiveIndicator(): void {
    // HACK: we are pushing audi's native js functions to the back of the event loop so that
    // ui animation changes are in sync with angular, or else the active paging indicator gets buggy
    setTimeout(() => {
      this.audiPaginationJsComponents.forEach((c: any) => c.update());
    }, 0);
  }

  get min(): boolean {
    return this.pagination.currentPage > 0;
  }

  get max(): number {
    return this.pagination.totalPages;
  }

  get range(): number[] {
    const delta = this.pageRange;
    const first = 1;
    const last = this.pagination.totalPages;
    const left = this.pagination.currentPage - delta;
    const right = this.pagination.currentPage + delta + 1;
    const result = Array.from(
      { length: this.pagination.totalPages },
      (v, k) => k + 1
    ).filter((i) => i && i >= left && i > first && i < right && i < last);

    return result;
  }

  ngOnDestroy(): void {
    if (this._breakpointObserverSubscription) {
      this._breakpointObserverSubscription.unsubscribe();
    }
  }
}
