import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Data, ParamMap, Router } from '@angular/router';
import {
  DynamicDocumentsService,
  BusyService,
  DynamicDocumentType,
  DynamicDocument,
} from '@audi/data';
import { throwError } from 'rxjs';
import { Subject } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'audi-dynamic-documents-single',
  templateUrl: './dynamic-documents-single.component.html',
  styleUrls: ['./dynamic-documents-single.component.scss'],
})
export class DynamicDocumentsSingleComponent implements OnInit, OnDestroy {
  dynamicDocument: DynamicDocument;
  dynamicDocumentType: DynamicDocumentType;

  dynamicDocumentTypeEnum: typeof DynamicDocumentType = DynamicDocumentType;

  loading: boolean = true;
  destroy$ = new Subject<boolean>();

  get imgHeaderBgImageUrl(): string {
    return `/assets/images/${this.dynamicDocumentType}-bg.jpg`;
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dynamicDocumentsService: DynamicDocumentsService,
    private busyService: BusyService
  ) {}

  ngOnInit(): void {
    this.route.data
      .pipe(
        switchMap((data: Data) => {
          this.dynamicDocumentType = data.documentType;

          return this.route.paramMap;
        }),
        switchMap((params: ParamMap) => {
          this.loading = true;

          if (
            this.dynamicDocumentType === DynamicDocumentType.Faq ||
            this.dynamicDocumentType === DynamicDocumentType.About
          ) {
            return this.dynamicDocumentsService[
              this.dynamicDocumentType
            ].getOne();
          } else {
            const hasDynamicDocumentId = params.has('documentId');

            if (!hasDynamicDocumentId) {
              return throwError(new HttpErrorResponse({ status: 404 }));
            }

            const dynamicDocumentId = +params.get('documentId')!;

            return this.dynamicDocumentsService[
              this.dynamicDocumentType
            ].getOne(dynamicDocumentId);
          }
        }),
        takeUntil(this.destroy$)
      )
      .subscribe(
        (dynamicDocument: DynamicDocument) => {
          this.dynamicDocument = dynamicDocument;
          this.loading = false;
          this.busyService.idle();
        },
        (error: HttpErrorResponse) => {
          if (error.status == 404) {
            this.router.navigate(['/', 'not-found']);
          }
        }
      );
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
