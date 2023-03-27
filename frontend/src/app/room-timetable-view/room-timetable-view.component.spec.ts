import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomTimetableViewComponent } from './room-timetable-view.component';

describe('RoomTimetableViewComponent', () => {
  let component: RoomTimetableViewComponent;
  let fixture: ComponentFixture<RoomTimetableViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RoomTimetableViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoomTimetableViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
