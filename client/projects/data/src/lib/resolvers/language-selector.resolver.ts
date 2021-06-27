import { Injectable } from '@angular/core';
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { LanguageCode } from '../models/language-code';
import { LanguageStateService } from '../services/language-state.service';

export interface LanguageSettings {
  defaultLanguage: LanguageCode;
  availableLanguages: LanguageCode[];
}

@Injectable({ providedIn: 'root' })
export class LanguageSelectorResolver implements Resolve<LanguageSettings> {
  constructor(private languageService: LanguageStateService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): LanguageSettings {
    const languageSettings: LanguageSettings = route.data?.languageSettings;

    if (languageSettings?.defaultLanguage != null) {
      this.languageService.selectLanguage(languageSettings.defaultLanguage);
    }

    return languageSettings;
  }
}
