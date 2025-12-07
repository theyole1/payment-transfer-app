import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAccountForm } from './add-account-form';

describe('AddAccountForm', () => {
  let component: AddAccountForm;
  let fixture: ComponentFixture<AddAccountForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddAccountForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddAccountForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
