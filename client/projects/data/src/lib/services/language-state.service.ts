import { Injectable, OnDestroy } from '@angular/core';
import { LanguageCode } from '../enums';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { distinctUntilChanged, filter, map, takeUntil } from 'rxjs/operators';
import {
  Router,
  ActivatedRoute,
  NavigationEnd,
  ParamMap,
  Event,
} from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class LanguageStateService implements OnDestroy {
  _language$ = new BehaviorSubject<LanguageCode>(LanguageCode.Zh);
  language$ = this._language$.asObservable().pipe(distinctUntilChanged());

  destroy$ = new Subject<boolean>();

  constructor(private router: Router) {
    // the only lifecycle hook available to services is OnDestroy,
    // so im doing this in the constructor instead of OnInit

    const validLanguageCodes = Object.keys(LanguageCode).map(
      (key) => (LanguageCode as any)[key]
    );

    // doing this to get router params in a service
    // (because cannot get any params by injecting and using ActivatedRoute in a service's constructor)
    // see: https://stackoverflow.com/questions/40219790/angular-2-get-routeparams-in-a-service

    const getLeafRoute = (
      route: ActivatedRoute
    ): ActivatedRoute | undefined | null => {
      if (route === null) return null;

      if (route.firstChild) {
        route = route.firstChild;
      }

      return route;
    };

    const languageCode$: Observable<LanguageCode> = router.events.pipe(
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

    languageCode$.subscribe((lang: LanguageCode) => this.selectLanguage(lang));
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  selectLanguage(language: LanguageCode): void {
    this._language$.next(language);
  }

  getCurrentLanguage(): LanguageCode {
    return this._language$.value;
  }
}
