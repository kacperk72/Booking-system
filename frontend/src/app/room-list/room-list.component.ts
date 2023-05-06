import {
  Component,
  EventEmitter,
  Input,
  Output,
  SimpleChanges,
} from '@angular/core';
import { RoomListService } from '../service/room-list.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';

export interface Room {
  id: string;
  roomName?: string;
  numberOfSeats?: number;
  roomType?: string;
}

@Component({
  selector: 'app-room-list',
  templateUrl: './room-list.component.html',
  styleUrls: ['./room-list.component.css'],
})
export class RoomListComponent {
  @Output()
  public chosenRoom = new EventEmitter<any>();

  typesOfClasses: Array<Room> = [
    {
      id: '1',
      roomName: 'A-1-01',
      numberOfSeats: 30,
      roomType: 'Sala lekcyjna z tablicą',
    },
    {
      id: '2',
      roomName: 'A-1-02',
      numberOfSeats: 120,
      roomType: 'Sala wykładowa',
    },
    {
      id: '3',
      roomName: 'A-2-03',
      numberOfSeats: 45,
      roomType: 'Sala lekcyjna z tablicą',
    },
    {
      id: '4',
      roomName: 'A-2-04',
      numberOfSeats: 15,
      roomType: 'Sala komputerowa',
    },
  ];
  sortingForm: FormGroup;
  displayedColumns: string[] = [
    'roomName',
    'numberOfSeats',
    'roomType',
    'details',
  ];
  filteredRooms: Array<Room> = [];
  dataSource = new MatTableDataSource<Room>(this.typesOfClasses);

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
  tableLoaded: boolean = false;

  ngOnInit() {
    this.getRooms();
    this.filterRoomsByDate();
  }

  private getRooms() {
    this.service.getRoomsFromApi().subscribe((rooms) => {
      rooms.forEach((room: any) => {
        this.typesOfClasses.push(room.NazwaSali);
        this.tableLoaded = true;
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

  filterRoomsByDate() {
    this.tableLoaded = false;
    this.filteredRooms = this.typesOfClasses;
    this.dataSource = new MatTableDataSource<Room>(this.filteredRooms);
    this.tableLoaded = true;
  }

  checkRoomDetails(rowData: any) {
    this.chosenRoom.emit(rowData);
  }
}
