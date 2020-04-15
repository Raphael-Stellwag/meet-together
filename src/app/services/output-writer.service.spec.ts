import { TestBed } from '@angular/core/testing';

import { OutputWriterService } from './output-writer.service';

describe('OutputWriterService', () => {
  let service: OutputWriterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OutputWriterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
