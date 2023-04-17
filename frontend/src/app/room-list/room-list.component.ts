import { Component, EventEmitter, Output } from '@angular/core';
import { RoomListService } from './room-list.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';

export interface Room {
  roomName: string;
  numberOfSeats: number;
  roomType: string;
}

@Component({
  selector: 'app-room-list',
  templateUrl: './room-list.component.html',
  styleUrls: ['./room-list.component.css'],
})
export class RoomListComponent {
  typesOfClasses = [
    {
      roomName: 'Sala A-1-01',
      numberOfSeats: 30,
      roomType: 'Sala lekcyjna z tablicą',
    },
    { roomName: 'Sala A-1-02', numberOfSeats: 120, roomType: 'Sala wykładowa' },
    {
      roomName: 'Sala A-2-03',
      numberOfSeats: 45,
      roomType: 'Sala lekcyjna z tablicą',
    },
    {
      roomName: 'Sala A-2-04',
      numberOfSeats: 15,
      roomType: 'Sala komputerowa',
    },
  ];
  sortingForm: FormGroup;
  displayedColumns: string[] = [
    'select',
    'roomName',
    'numberOfSeats',
    'roomType',
  ];
  dataSource = new MatTableDataSource<Room>(this.typesOfClasses);
  selection = new SelectionModel<Room>(true, []);

  constructor(
    private service: RoomListService,
    private formBuilder: FormBuilder
  ) {
    this.sortingForm = this.formBuilder.group({
      roomName: [''],
      numberOfSeats: [''],
      roomType: [''],
    });
  }

  ngOnInit() {
    this.getRooms();
  }

  @Output()
  public reservationButton = new EventEmitter<MouseEvent>();
  @Output()
  public chosenClass = new EventEmitter<string>();

  public setChosenClass(value: string) {
    this.chosenClass.emit(value);
  }

  private getRooms() {
    this.service.getRoomsFromApi().subscribe((rooms) => {
      console.log(rooms);
      rooms.forEach((room: any) => {
        this.typesOfClasses.push(room.NazwaSali);
      });
    });
  }

  onSubmit(): void {
    if (this.sortingForm.valid) {
      console.log(this.sortingForm.value);
      this.service
        .getFilteredRoomsFromApi(
          this.sortingForm.value.roomName,
          this.sortingForm.value.numberOfSeats,
          this.sortingForm.value.roomType
        )
        .subscribe((data) => {
          this.typesOfClasses = data;
        });
    }
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  masterToggle() {
    if (this.isAllSelected()) {
      this.selection.clear();
    } else {
      this.dataSource.data.forEach((row) => this.selection.select(row));
    }
  }

  getSelectedRooms(event: MouseEvent) {
    this.reservationButton.emit(event);
    console.log('Wybrane sale:', this.selection.selected);
    return this.selection.selected;
  }
}
