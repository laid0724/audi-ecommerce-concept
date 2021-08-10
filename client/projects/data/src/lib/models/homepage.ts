import { LanguageCode } from '../enums';
import { HomepageCarouselItem } from './homepage-carousel-item';
import { Product } from './product';

export interface Homepage {
  id: number;
  language: LanguageCode;
  carouselItems: HomepageCarouselItem[];
  featuredProducts: Product[];
}
