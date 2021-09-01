import { Inject, Injectable, Injector, OnDestroy } from '@angular/core';
import { LanguageCode } from '../enums';
import { INJECT_TRANSLOCO } from '../tokens';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { distinctUntilChanged, filter, map, takeUntil } from 'rxjs/operators';
import {
  Router,
  ActivatedRoute,
  NavigationEnd,
  ParamMap,
  Event,
} from '@angular/router';
import { TranslocoService } from '@ngneat/transloco';

@Injectable({
  providedIn: 'root',
})
export class LanguageStateService implements OnDestroy {
  _language$ = new BehaviorSubject<LanguageCode>(LanguageCode.Zh);
  language$ = this._language$.asObservable().pipe(distinctUntilChanged());

  transloco: TranslocoService | null;

  destroy$ = new Subject<boolean>();

  constructor(
    @Inject(INJECT_TRANSLOCO) private injectTransloco: boolean,
    private injector: Injector,
    private router: Router
  ) {
    // the only lifecycle hook available to services is OnDestroy,
    // so im doing these in the constructor instead of OnInit

    /*
      here, we are using injector to conditionally inject the transloco service based on the INJECT_TRANSLOCO token.
      i am doing this because the @Optional decorator does not work with transloco service, as it insists on looking for its module when injected
      see: https://stackoverflow.com/questions/43450259/how-to-conditionally-inject-service-into-component
      and see: https://stackoverflow.com/questions/52110168/angular-6-is-it-possible-to-inject-service-by-condition
    */
    if (injectTransloco) {
      this.transloco = injector.get<TranslocoService>(TranslocoService);
    }

    this.setLanguageByRoute();
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  selectLanguage(language: LanguageCode): void {
    localStorage.setItem('language', language);
    this._language$.next(language);
    this.transloco?.setActiveLang(language);
  }

  getCurrentLanguage(): LanguageCode {
    return this._language$.value;
  }

  setLanguageByRoute(): void {
    /*
      doing the following to get router params in a service
      (because cannot get any params by injecting and using ActivatedRoute in a service's constructor)
      see: https://stackoverflow.com/questions/40219790/angular-2-get-routeparams-in-a-service
    */

    const validLanguageCodes = Object.keys(LanguageCode).map(
      (key) => (LanguageCode as any)[key]
    );

    const getLeafRoute = (
      route: ActivatedRoute
    ): ActivatedRoute | undefined | null => {
      if (route === null) return null;

      if (route.firstChild) {
        route = route.firstChild;
      }

      return route;
    };

    const languageCode$: Observable<LanguageCode> = this.router.events.pipe(
      filter((event: Event) => event instanceof NavigationEnd),
      map(
        (event: Event) =>
          getLeafRoute(this.router.routerState.root)?.snapshot.paramMap
      ),
      filter((params: ParamMap | undefined | null) =>
        params != null
          ? params.has('languageCode') &&
            validLanguageCodes.includes(params.get('languageCode'))
          : false
      ),
      map(
        (params: ParamMap | undefined | null) =>
          params?.get('languageCode') as LanguageCode
      ),
      takeUntil(this.destroy$)
    );

    languageCode$.subscribe((lang: LanguageCode) => {
      localStorage.setItem('language', lang);
      if (this.getCurrentLanguage() !== lang) {
        this.selectLanguage(lang);
      }
    });
  }
}
