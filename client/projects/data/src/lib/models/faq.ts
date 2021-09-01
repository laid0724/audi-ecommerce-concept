import { DynamicDocumentType } from '../enums';
import { DynamicDocumentPhoto } from './dynamic-document-photo';

export interface Faq {
  id: number;
  title: string;
  type: DynamicDocumentType;
  introduction: string;
  featuredImage: DynamicDocumentPhoto;
  faqItems: FaqItem[];
}

export interface FaqItem {
  question: string;
  answer: string;
}
