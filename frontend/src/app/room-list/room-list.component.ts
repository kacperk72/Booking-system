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

export interface Room {
  id: string;
  NazwaSali?: string;
  IloscMiejsc?: number;
  TypSali?: string;
}

@Component({
  selector: 'app-room-list',
  templateUrl: './room-list.component.html',
  styleUrls: ['./room-list.component.css'],
})
export class RoomListComponent {
  @Output()
  public chosenRoom = new EventEmitter<any>();

  typesOfClasses: Array<Room> = [];
  sortingForm: FormGroup;
  displayedColumns: string[] = [
    'NazwaSali',
    'IloscMiejsc',
    'TypSali',
    'details',
  ];
  filteredRooms: Array<Room> = [];
  dataSource = new MatTableDataSource<Room>(this.typesOfClasses);

  constructor(
    private service: RoomListService,
    private formBuilder: FormBuilder
  ) {
    this.sortingForm = this.formBuilder.group({
      NazwaSali: [''],
      IloscMiejsc: [''],
      TypSali: [''],
    });
  }
  tableLoaded: boolean = false;

  ngOnInit() {
    this.getRooms();
    this.tableLoaded = true;
  }

  private getRooms() {
    this.tableLoaded = false;
    this.service.getRoomsFromApi().subscribe((rooms) => {
      rooms.forEach((room: any) => {
        this.typesOfClasses.push(room);
      });
      this.dataSource = new MatTableDataSource<Room>(this.typesOfClasses);
      this.tableLoaded = true;
    });
  }

  onSubmit(): void {
    if (this.sortingForm.valid) {
      console.log(this.sortingForm.value);
      this.service
        .getFilteredRoomsFromApi(
          this.sortingForm.value.NazwaSali,
          this.sortingForm.value.IloscMiejsc,
          this.sortingForm.value.TypSali
        )
        .subscribe((data) => {
          this.typesOfClasses = data;
          this.dataSource = new MatTableDataSource<Room>(this.typesOfClasses);
        });
    }
  }

  checkRoomDetails(rowData: any) {
    this.chosenRoom.emit(rowData);
  }
}
