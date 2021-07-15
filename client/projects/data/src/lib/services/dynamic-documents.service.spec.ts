import { TestBed } from '@angular/core/testing';

import { DynamicDocumentsService } from './dynamic-documents.service';

describe('DynamicDocumentsService', () => {
  let service: DynamicDocumentsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DynamicDocumentsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
