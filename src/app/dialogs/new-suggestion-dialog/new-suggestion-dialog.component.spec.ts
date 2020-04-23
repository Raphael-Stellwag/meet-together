import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewSuggestionDialog } from './new-suggestion-dialog.component';

describe('NewSuggestionDialogComponent', () => {
  let component: NewSuggestionDialog;
  let fixture: ComponentFixture<NewSuggestionDialog>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewSuggestionDialog ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewSuggestionDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
