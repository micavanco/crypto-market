import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdersTableRow } from './orders-table-row';

describe('OrdersTableRow', () => {
  let component: OrdersTableRow;
  let fixture: ComponentFixture<OrdersTableRow>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrdersTableRow]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrdersTableRow);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
