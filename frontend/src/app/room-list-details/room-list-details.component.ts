import { SelectionModel } from '@angular/cdk/collections';
import {
  Component,
  EventEmitter,
  Input,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { RoomListService } from '../service/room-list.service';
import { MatDialog } from '@angular/material/dialog';
import { TimePickerModalComponent } from '../time-picker-modal/time-picker-modal.component';

export interface Room {
  id: string;
  date?: string;
  startTime?: string;
  endTime?: string;
}

@Component({
  selector: 'app-room-list-details',
  templateUrl: './room-list-details.component.html',
  styleUrls: ['./room-list-details.component.css'],
})
export class RoomListDetailsComponent {
  @Input() selectedDate!: Date;
  @Input() chosenClass: any;

  @Output()
  public reservationData = new EventEmitter<any>();

  @Output()
  public getback = new EventEmitter<boolean>();

  typesOfClasses: Array<Room> = [
    {
      id: '1',
      date: '06-05-2023',
      startTime: '10.00',
      endTime: '12.00',
    },
    {
      id: '2',
      date: '06-05-2023',
      startTime: '12.00',
      endTime: '14.00',
    },
    {
      id: '3',
      date: '07-05-2023',
      startTime: '8.00',
      endTime: '10.00',
    },
    {
      id: '4',
      date: '07-05-2023',
      startTime: '12.00',
      endTime: '14.00',
    },
  ];
  sortingForm: FormGroup;
  displayedColumns: string[] = ['select', 'date', 'hour'];
  selection = new SelectionModel<Room>(true, []);
  filteredRooms: Array<Room> = [];
  dataSource = new MatTableDataSource<Room>(this.filteredRooms);

  constructor(
    private service: RoomListService,
    private formBuilder: FormBuilder,
    public dialog: MatDialog
  ) {
    this.sortingForm = this.formBuilder.group({
      roomName: [''],
      numberOfSeats: [''],
      roomType: [''],
    });
  }
  tableLoaded: boolean = false;

  ngOnInit() {
    console.log('detail', this.chosenClass);

    this.getRooms();
    this.filterRoomsByDate(new Date());
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['selectedDate'] && changes['selectedDate'].currentValue) {
      this.filterRoomsByDate(this.selectedDate);
    }
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

  getBack() {
    this.getback.emit(true);
  }

  openTimePickerModal() {
    const dialogRef = this.dialog.open(TimePickerModalComponent);
  }
}
