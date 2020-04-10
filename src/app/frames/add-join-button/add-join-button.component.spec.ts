import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddJoinButtonComponent } from './add-join-button.component';

describe('AddJoinButtonComponent', () => {
  let component: AddJoinButtonComponent;
  let fixture: ComponentFixture<AddJoinButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddJoinButtonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddJoinButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
