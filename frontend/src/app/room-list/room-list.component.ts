import {
  Component,
  EventEmitter,
  Input,
  Output,
  SimpleChanges,
} from '@angular/core';
import { RoomListService } from './room-list.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';

export interface Room {
  id: string;
  roomName: string;
  numberOfSeats: number;
  roomType: string;
  date: string;
  startTime: string;
  endTime: string;
}

@Component({
  selector: 'app-room-list',
  templateUrl: './room-list.component.html',
  styleUrls: ['./room-list.component.css'],
})
export class RoomListComponent {
  @Input() selectedDate!: Date;

  @Output()
  public reservationData = new EventEmitter<any>();
  @Output()
  public chosenClass = new EventEmitter<string>();

  typesOfClasses: Array<Room> = [
    {
      id: '1',
      roomName: 'A-1-01',
      numberOfSeats: 30,
      roomType: 'Sala lekcyjna z tablicą',
      date: '21-04-2023',
      startTime: '10.00',
      endTime: '12.00',
    },
    {
      id: '2',
      roomName: 'A-1-02',
      numberOfSeats: 120,
      roomType: 'Sala wykładowa',
      date: '22-04-2023',
      startTime: '10.00',
      endTime: '12.00',
    },
    {
      id: '3',
      roomName: 'A-2-03',
      numberOfSeats: 45,
      roomType: 'Sala lekcyjna z tablicą',
      date: '23-04-2023',
      startTime: '8.00',
      endTime: '10.00',
    },
    {
      id: '4',
      roomName: 'A-2-04',
      numberOfSeats: 15,
      roomType: 'Sala komputerowa',
      date: '23-04-2023',
      startTime: '12.00',
      endTime: '14.00',
    },
  ];
  sortingForm: FormGroup;
  displayedColumns: string[] = [
    'select',
    'roomName',
    'numberOfSeats',
    'roomType',
    'date',
    'hour',
  ];
  selection = new SelectionModel<Room>(true, []);
  filteredRooms: Array<Room> = [];
  dataSource = new MatTableDataSource<Room>(this.filteredRooms);

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
    this.filterRoomsByDate(new Date());
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['selectedDate'] && changes['selectedDate'].currentValue) {
      this.filterRoomsByDate(this.selectedDate);
    }
  }

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

  getSelectedRooms() {
    this.reservationData.emit(this.selection.selected);
    console.log('Wybrane sale:', this.selection.selected);
  }

  formatDate(date: Date): string {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
  }

  filterRoomsByDate(date: Date) {
    this.tableLoaded = false;
    const selectedDateString = this.formatDate(date);
    this.filteredRooms = this.typesOfClasses.filter(
      (room) => room.date === selectedDateString
    );
    this.dataSource = new MatTableDataSource<Room>(this.filteredRooms);
    this.tableLoaded = true;
  }
}
