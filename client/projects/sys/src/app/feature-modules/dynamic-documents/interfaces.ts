import { ValidatorFn } from '@angular/forms';
import { DynamicDocumentType, LanguageCode } from '@audi/data';

export interface DynamicDocumentData {
  languageSettings: LanguageSettings;
  dynamicDocumentSettings: DynamicDocumentSettings;
}

export interface LanguageSettings {
  defaultLanguage: LanguageCode;
  availableLanguages: LanguageCode[];
}

export interface DynamicDocumentSettings {
  type: DynamicDocumentType;
  typeName: {
    zh: string;
    en: string;
  };
  datagridColumns: DynamicDocumentDatagridColumn[];
  form: DynamicDocumentFormSettings;
  hasFeaturedImage: boolean;
  saveOnly: boolean;
}

export interface DynamicDocumentDatagridColumn {
  label: string;
  key: string;
  type: DynamicDocumentDatagridColumnType;
  filter?: DynamicDocumentDatagridFilter;
}

export type DynamicDocumentDatagridColumnType = 'string' | 'boolean' | 'date' | 'datetime' | 'isVisible'

export type DynamicDocumentDatagridFilter = 'title' | 'isVisible' | 'date' | 'createdAt' | 'lastUpdated';

export interface DynamicDocumentFormSettings {
  fields: DynamicDocumentFormField[];
}

export interface DynamicDocumentFormField {
  key: string;
  label: string;
  type: DynamicDocumentFormFieldType;
  validators?: ValidatorFn[];
}

export type DynamicDocumentFormFieldType =
  | 'textarea'
  | 'text'
  | 'number'
  | 'radio'
  | 'toggle'
  | 'date'
  | 'wysiwyg'
  | 'faqitems';
