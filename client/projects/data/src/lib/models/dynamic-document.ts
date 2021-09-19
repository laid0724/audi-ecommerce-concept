import { DynamicDocumentType } from '../enums';
import { About } from './about';
import { DynamicDocumentPhoto } from './dynamic-document-photo';
import { Faq } from './faq';
import { WysiwygGrid } from './wysiwyg';

export interface DynamicDocumentBase {
  id: number;
  title: string;
  type: DynamicDocumentType;
  introduction: string;
  wysiwyg: WysiwygGrid;
  featuredImage: DynamicDocumentPhoto;
  date?: Date;
  createdAt: Date;
  lastUpdated: Date;
  isVisible: boolean;
}

export interface News extends DynamicDocumentBase {}

export interface Event extends DynamicDocumentBase {}

export type DynamicDocument = News | Event | Faq | About;
