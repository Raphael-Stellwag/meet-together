import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewUserDialog } from './new-user-dialog.component';

describe('NewUserComponent', () => {
  let component: NewUserDialog;
  let fixture: ComponentFixture<NewUserDialog>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewUserDialog ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewUserDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
