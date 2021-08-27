import { InjectionToken } from '@angular/core';

export const INJECT_TOASTR = new InjectionToken<boolean>(
  'injectToastr'
);

export const INJECT_TRANSLOCO = new InjectionToken<boolean>(
  'injectTransloco'
);
