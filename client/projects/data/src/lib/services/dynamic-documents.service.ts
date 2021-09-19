import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DynamicDocumentParams } from '../models/dynamic-document-params';
import { News, Event } from '../models/dynamic-document';
import { Faq, FaqItem } from '../models/faq';
import { About } from '../models/about';
import { PaginatedResult } from '../models/pagination';
import { WysiwygGrid } from '../models/wysiwyg';
import { getPaginatedResult, getPaginationHeaders } from '../helpers';
import { DynamicDocumentType } from '../enums';

interface DynamicDocumentUpsertRequest {
  id?: number;
  title: string;
  type: string;
  introduction: string;
  wysiwyg: WysiwygGrid;
  date?: Date;
  isVisible: boolean;
}

interface FaqUpsertRequest {
  id: number;
  title: string;
  introduction: string;
  faqItems: FaqItem[];
}

interface AboutUpsertRequest {
  id: number;
  title: string;
  introduction: string;
  wysiwyg: WysiwygGrid;
}

interface DynamicDocumentCrudFunctions<TUpsertRequest, TResult> {
  getOne: (dynamicDocumentId: number) => Observable<TResult>;
  getAll: (
    queryParams: DynamicDocumentParams
  ) => Observable<PaginatedResult<TResult[]>>;
  getAllIsVisible: (
    queryParams: DynamicDocumentParams
  ) => Observable<PaginatedResult<TResult[]>>;
  add: (upsertRequest: TUpsertRequest) => Observable<TResult>;
  update: (upsertRequest: TUpsertRequest) => Observable<TResult>;
  delete: (dynamicDocumentId: number) => Observable<null>;
  deleteFeaturedImage: (dynamicDocumentId: number) => Observable<null>;
}

interface FaqCrudFunctions {
  getOne: () => Observable<Faq>;
  update: (upsertRequest: FaqUpsertRequest) => Observable<Faq>;
  // deleteFeaturedImage: (dynamicDocumentId: number) => Observable<null>;
}
interface AboutCrudFunctions {
  getOne: () => Observable<About>;
  update: (upsertRequest: AboutUpsertRequest) => Observable<About>;
  // deleteFeaturedImage: (dynamicDocumentId: number) => Observable<null>;
}

const buildCrudFunctions = <TUpsertRequest, TResult>(
  http: HttpClient,
  endpoint: string,
  documentType: DynamicDocumentType
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

      params = params.append('type', documentType);

      return getPaginatedResult<TResult[]>(http, endpoint, params);
    },
    getAllIsVisible: (queryParams: DynamicDocumentParams) => {
      const { pageNumber, pageSize, ...qp } = queryParams;
      let params = getPaginationHeaders(pageNumber, pageSize);

      Object.keys(qp).forEach((key) => {
        // @ts-ignore
        const property = qp[key];
        if (property != null) {
          params = params.append(key, property.toString());
        }
      });

      params = params.append('type', documentType);
      params = params.append('isVisible', true);

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

  readonly news: DynamicDocumentCrudFunctions<
    DynamicDocumentUpsertRequest,
    News
  >;
  readonly events: DynamicDocumentCrudFunctions<
    DynamicDocumentUpsertRequest,
    Event
  >;
  readonly faq: FaqCrudFunctions;
  readonly about: AboutCrudFunctions;

  constructor(private http: HttpClient) {
    this.news = buildCrudFunctions<DynamicDocumentUpsertRequest, News>(
      http,
      this.endpoint + '/news',
      DynamicDocumentType.News
    );
    this.events = buildCrudFunctions<DynamicDocumentUpsertRequest, Event>(
      http,
      this.endpoint + '/events',
      DynamicDocumentType.Event
    );

    const faqCrud = buildCrudFunctions<FaqUpsertRequest, Faq>(
      http,
      this.endpoint + '/faq',
      DynamicDocumentType.Faq
    );

    this.faq = {
      getOne: () => http.get<Faq>(this.endpoint + '/faq'),
      update: faqCrud.update,
      // deleteFeaturedImage: faqCrud.deleteFeaturedImage,
    };

    const aboutCrud = buildCrudFunctions<AboutUpsertRequest, About>(
      http,
      this.endpoint + '/about',
      DynamicDocumentType.About
    );

    this.about = {
      getOne: () => http.get<About>(this.endpoint + '/about'),
      update: aboutCrud.update,
      // deleteFeaturedImage: aboutCrud.deleteFeaturedImage,
    };
  }
}
