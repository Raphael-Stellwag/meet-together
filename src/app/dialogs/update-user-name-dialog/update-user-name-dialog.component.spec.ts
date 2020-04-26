import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateUserNameDialog } from './update-user-name-dialog.component';

describe('UpdateUserNameDialogComponent', () => {
  let component: UpdateUserNameDialog;
  let fixture: ComponentFixture<UpdateUserNameDialog>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UpdateUserNameDialog]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateUserNameDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
