import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CarouselType } from '../enums';
import { Homepage } from '../models/homepage';
import { HomepageCarouselItem } from '../models/homepage-carousel-item';

export interface CarouselItemUpsert {
  id?: number;
  type: CarouselType;
  sort: number;
  title: string;
  subTitle: string;
  body: string;
  isVisible: boolean;
  primaryButtonLabel: string;
  primaryButtonUrl: string;
  secondaryButtonLabel: string;
  secondaryButtonUrl: string;
}

export interface HomepageCarouselItemsSort {
  carouselItemIds: number[];
}

export interface HomepageFeaturedProductsUpsert {
  featuredProductIds: number[];
}

@Injectable({
  providedIn: 'root',
})
export class HomepageService {
  private endpoint = '/api/homepage';

  constructor(private http: HttpClient) {}

  getHomepage(): Observable<Homepage> {
    return this.http.get<Homepage>(this.endpoint);
  }

  updateHomepageFeaturedProducts(
    request: HomepageFeaturedProductsUpsert
  ): Observable<Homepage> {
    return this.http.put<Homepage>(
      `${this.endpoint}/featured-products`,
      request
    );
  }

  addHomepageCarouselItem(
    request: CarouselItemUpsert
  ): Observable<HomepageCarouselItem> {
    return this.http.post<HomepageCarouselItem>(
      `${this.endpoint}/carousel`,
      request
    );
  }

  updateHomepageCarouselItem(
    request: CarouselItemUpsert
  ): Observable<HomepageCarouselItem> {
    return this.http.put<HomepageCarouselItem>(
      `${this.endpoint}/carousel`,
      request
    );
  }

  sortHomepageCarouselItems(
    request: HomepageCarouselItemsSort
  ): Observable<HomepageCarouselItem[]> {
    return this.http.patch<HomepageCarouselItem[]>(
      `${this.endpoint}/carousel/sort`,
      request
    );
  }

  deleteHomepageCarouselItem(carouselItemId: number): Observable<null> {
    return this.http.delete<null>(
      `${this.endpoint}/carousel/${carouselItemId}`
    );
  }

  addPhotoToHomepageCarouselItem(
    carouselItemId: number,
    file: File
  ): Observable<HomepageCarouselItem> {
    return this.http.post<HomepageCarouselItem>(
      `${this.endpoint}/carousel/${carouselItemId}/photos`,
      file
    );
  }

  removePhotoFromHomepageCarouselItem(
    carouselItemId: number
  ): Observable<HomepageCarouselItem> {
    return this.http.delete<HomepageCarouselItem>(
      `${this.endpoint}/carousel/${carouselItemId}/photos`
    );
  }
}
