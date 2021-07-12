import { DynamicDocumentType } from "../enums";
import { DynamicDocumentPhoto } from "./dynamic-document-photo";
import { WysiwygGrid } from "./wysiwyg";

export interface DynamicDocument {
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

export interface News extends DynamicDocument {}

export interface Event extends DynamicDocument {}
