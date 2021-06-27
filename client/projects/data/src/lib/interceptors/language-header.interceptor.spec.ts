import { TestBed } from '@angular/core/testing';

import { LanguageHeaderInterceptor } from './language-header.interceptor';

describe('LanguageHeaderInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      LanguageHeaderInterceptor
      ]
  }));

  it('should be created', () => {
    const interceptor: LanguageHeaderInterceptor = TestBed.inject(LanguageHeaderInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
