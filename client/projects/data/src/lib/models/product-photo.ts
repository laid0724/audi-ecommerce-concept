import { Photo } from './photo';

export interface ProductPhoto extends Photo {
  isMain: boolean;
  productId: number;
}
