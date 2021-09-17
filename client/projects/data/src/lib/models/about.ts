import { DynamicDocumentType } from '../enums';
import { DynamicDocumentPhoto } from './dynamic-document-photo';
import { WysiwygGrid } from './wysiwyg';

export interface About {
  id: number;
  title: string;
  type: DynamicDocumentType;
  introduction: string;
  featuredImage: DynamicDocumentPhoto;
  wysiwyg: WysiwygGrid;
}
