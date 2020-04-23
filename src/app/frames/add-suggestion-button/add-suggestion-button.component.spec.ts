import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSuggestionButtonComponent } from './add-suggestion-button.component';

describe('AddSuggestionButtonComponent', () => {
  let component: AddSuggestionButtonComponent;
  let fixture: ComponentFixture<AddSuggestionButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddSuggestionButtonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddSuggestionButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
