import { Component, Input } from '@angular/core';
import {
  DynamicDocumentType,
  Event,
  LanguageCode,
  LanguageStateService,
  News,
} from '@audi/data';

@Component({
  selector: 'audi-dynamic-documents-card',
  templateUrl: './dynamic-documents-card.component.html',
  styleUrls: ['./dynamic-documents-card.component.scss'],
})
export class DynamicDocumentsCardComponent {
  @Input() dynamicDocument: Event | News;
  @Input() dynamicDocumentType: DynamicDocumentType;

  get language(): LanguageCode {
    return this.languageService.getCurrentLanguage();
  }

  constructor(private languageService: LanguageStateService) {}
}
