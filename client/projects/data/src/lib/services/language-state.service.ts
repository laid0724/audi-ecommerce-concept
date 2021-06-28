import { Injectable } from '@angular/core';
import { LanguageCode } from "../enums";
import { BehaviorSubject } from "rxjs";
import { distinctUntilChanged } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class LanguageStateService {

  _language$ = new BehaviorSubject<LanguageCode>(LanguageCode.Zh);
  language$ = this._language$.asObservable().pipe(distinctUntilChanged());

  constructor() {}

  selectLanguage(language: LanguageCode): void {
    this._language$.next(language);
  }

  getCurrentLanguage(): LanguageCode {
    return this._language$.value;
  }
}
