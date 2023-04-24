import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminReservationListComponent } from './admin-reservation-list.component';

describe('AdminReservationListComponent', () => {
  let component: AdminReservationListComponent;
  let fixture: ComponentFixture<AdminReservationListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminReservationListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminReservationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
