import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Data, Router } from '@angular/router';
import {
  setQueryParams,
  LanguageCode,
  LanguageStateService,
} from '@audi/data';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'audi-sys-language-selector',
  templateUrl: './language-selector.component.html',
  styleUrls: ['./language-selector.component.scss'],
})
export class LanguageSelectorComponent implements OnInit {
  languages$: Observable<LanguageCode[]>;

  constructor(
    public languageState: LanguageStateService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.languages$ = this.route.data.pipe(
      map((data: Data) =>
        Array.isArray(data?.languageSettings?.availableLanguages)
          ? data?.languageSettings?.availableLanguages
          : [
              ...Object.keys(LanguageCode).map(
                (key) => (LanguageCode as unknown as any)[key]
              ),
            ]
      )
    );
  }

  onChangeLanguage(language: LanguageCode): void {
    this.languageState.selectLanguage(language);
    setQueryParams(this.router, this.route);
  }
}
