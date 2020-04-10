import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewEventDialog } from './new-event-dialog.component';

describe('AddEventDialogComponent', () => {
  let component: NewEventDialog;
  let fixture: ComponentFixture<NewEventDialog>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NewEventDialog]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewEventDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
