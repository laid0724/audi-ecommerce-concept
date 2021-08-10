import { CarouselType } from '../enums';
import { CarouselItemPhoto } from './carousel-item-photo';

export interface CarouselItem {
  id: number;
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
  photo: CarouselItemPhoto;
}
