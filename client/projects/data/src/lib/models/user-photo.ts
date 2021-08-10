import { Photo } from './photo';

export interface UserPhoto extends Photo {
  userId: number;
}
