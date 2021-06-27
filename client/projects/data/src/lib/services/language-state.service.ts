import { Injectable } from '@angular/core';
import { LanguageCode } from "../models/language-code";
import { BehaviorSubject } from "rxjs";
import { distinctUntilChanged } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class LanguageStateService {

  _language$ = new BehaviorSubject<LanguageCode>('zh');
  language$ = this._language$.asObservable().pipe(distinctUntilChanged());

  constructor() {}

  selectLanguage(language: LanguageCode): void {
    this._language$.next(language);
  }

  getCurrentLanguage(): LanguageCode {
    return this._language$.value;
  }
}
