import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChosenRoomComponent } from './chosen-room.component';

describe('ChosenRoomComponent', () => {
  let component: ChosenRoomComponent;
  let fixture: ComponentFixture<ChosenRoomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChosenRoomComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChosenRoomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
