import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewOrderForm } from './new-order-form';

describe('NewOrderForm', () => {
  let component: NewOrderForm;
  let fixture: ComponentFixture<NewOrderForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewOrderForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewOrderForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
