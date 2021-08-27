import { HttpClient } from '@angular/common/http';
import {
  TRANSLOCO_LOADER,
  Translation,
  TranslocoLoader,
  TRANSLOCO_CONFIG,
  translocoConfig,
  TranslocoModule,
} from '@ngneat/transloco';
import { Injectable, NgModule } from '@angular/core';
import { environment } from '../../environments/environment';
import { BusyService, LanguageCode } from '@audi/data';
import { tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TranslocoHttpLoader implements TranslocoLoader {
  constructor(private http: HttpClient, private busyService: BusyService) {}

  getTranslation(lang: LanguageCode): Observable<Translation> {
    return this.http
      .get<Translation>(`${environment.baseUrl}/assets/i18n/${lang}.json`)
      .pipe(tap((translation: Translation) => this.busyService.idle()));
  }
}

@NgModule({
  exports: [TranslocoModule],
  providers: [
    {
      provide: TRANSLOCO_CONFIG,
      useValue: translocoConfig({
        availableLangs: ['en', 'zh'],
        defaultLang: 'zh',
        fallbackLang: 'zh',
        // Remove this option if your application doesn't support changing language in runtime.
        reRenderOnLangChange: true,
        prodMode: environment.production,
      }),
    },
    { provide: TRANSLOCO_LOADER, useClass: TranslocoHttpLoader },
  ],
})
export class TranslocoRootModule {}
