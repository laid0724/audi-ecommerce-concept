import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DynamicDocumentParams } from '../models/dynamic-document-params';
import { News, Event } from '../models/dynamic-document';
import { Faq, FaqItem } from '../models/faq';
import { PaginatedResult } from '../models/pagination';
import { WysiwygGrid } from '../models/wysiwyg';
import { getPaginatedResult, getPaginationHeaders } from '../helpers';

export interface DynamicDocumentUpsertRequest {
  id?: number;
  title: string;
  type: string;
  introduction: string;
  wysiwyg: WysiwygGrid;
  date?: Date;
  isVisible: boolean;
}

export interface FaqUpsertRequest {
  id: number;
  title: string;
  introduction: string;
  faqItems: FaqItem[];
}

export interface DynamicDocumentCrudFunctions<TUpsertRequest, TResult> {
  getOne: (dynamicDocumentId: number) => Observable<TResult>;
  getAll: (
    queryParams: DynamicDocumentParams
  ) => Observable<PaginatedResult<TResult[]>>;
  add: (upsertRequest: TUpsertRequest) => Observable<TResult>;
  update: (upsertRequest: TUpsertRequest) => Observable<TResult>;
  delete: (dynamicDocumentId: number) => Observable<null>;
  deleteFeaturedImage: (dynamicDocumentId: number) => Observable<null>;
}

export interface FaqCrudFunctions {
  getOne: () => Observable<Faq>;
  update: (upsertRequest: FaqUpsertRequest) => Observable<Faq>;
  deleteFeaturedImage: (dynamicDocumentId: number) => Observable<null>;
}

const buildCrudFunctions = <TUpsertRequest, TResult>(
  http: HttpClient,
  endpoint: string
): DynamicDocumentCrudFunctions<TUpsertRequest, TResult> => {
  return {
    getOne: (dynamicDocumentId: number) =>
      http.get<TResult>(`${endpoint}/${dynamicDocumentId}`),
    getAll: (queryParams: DynamicDocumentParams) => {
      const { pageNumber, pageSize, ...qp } = queryParams;
      let params = getPaginationHeaders(pageNumber, pageSize);

      Object.keys(qp).forEach((key) => {
        // @ts-ignore
        const property = qp[key];
        if (property != null) {
          params = params.append(key, property.toString());
        }
      });

      return getPaginatedResult<TResult[]>(http, endpoint, params);
    },
    add: (upsertRequest: TUpsertRequest) =>
      http.post<TResult>(endpoint, upsertRequest),
    update: (upsertRequest: TUpsertRequest) =>
      http.put<TResult>(endpoint, upsertRequest),
    delete: (dynamicDocumentId: number) =>
      http.delete<null>(`${endpoint}/${dynamicDocumentId}`),
    deleteFeaturedImage: (dynamicDocumentId: number) =>
      http.delete<null>(`${endpoint}/${dynamicDocumentId}/featured-image`),
  };
};

@Injectable({
  providedIn: 'root',
})
export class DynamicDocumentsService {
  private endpoint = '/api/dynamicdocuments';
  private faqEndpoint = `${this.endpoint}/faq`;
  private eventEndpoint = `${this.endpoint}/events`;
  private newsEndpoint = `${this.endpoint}/news`;

  readonly news: DynamicDocumentCrudFunctions<
    DynamicDocumentUpsertRequest,
    News
  >;
  readonly events: DynamicDocumentCrudFunctions<
    DynamicDocumentUpsertRequest,
    Event
  >;
  readonly faq: FaqCrudFunctions;

  constructor(private http: HttpClient) {
    this.news = buildCrudFunctions<DynamicDocumentUpsertRequest, News>(
      http,
      this.newsEndpoint
    );
    this.events = buildCrudFunctions<DynamicDocumentUpsertRequest, Event>(
      http,
      this.eventEndpoint
    );

    const faqCrud = buildCrudFunctions<FaqUpsertRequest, Faq>(
      http,
      this.faqEndpoint
    );

    this.faq = {
      getOne: () => http.get<Faq>(this.faqEndpoint),
      update: faqCrud.update,
      deleteFeaturedImage: faqCrud.deleteFeaturedImage,
    };
  }
}
