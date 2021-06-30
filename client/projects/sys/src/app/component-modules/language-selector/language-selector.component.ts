import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Data, Router } from '@angular/router';
import { LanguageCode, LanguageStateService } from '@audi/data';
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

  clearQueryParams(): void {
    // currently, no native angular method to clear query params on the same page
    // this is a workaround to that
    // see: https://stackoverflow.com/questions/48552993/angular-5-remove-query-param
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {},
      queryParamsHandling: '',
    });
  }

  onChangeLanguage(language: LanguageCode): void {
    this.languageState.selectLanguage(language);
    this.clearQueryParams();
  }
}
