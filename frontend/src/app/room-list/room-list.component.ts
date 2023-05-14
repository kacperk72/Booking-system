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

  typesOfClasses: Array<Room> = [
    /*{
      id: '1',
      NazwaSali: 'A-1-01',
      IloscMiejsc: 30,
      TypSali: 'Sala lekcyjna z tablicą',
    },
    {
      id: '2',
      NazwaSali: 'A-1-02',
      IloscMiejsc: 120,
      TypSali: 'Sala wykładowa',
    },
    {
      id: '3',
      NazwaSali: 'A-2-03',
      IloscMiejsc: 45,
      TypSali: 'Sala lekcyjna z tablicą',
    },
    {
      id: '4',
      NazwaSali: 'A-2-04',
      IloscMiejsc: 15,
      TypSali: 'Sala komputerowa',
    },*/
  ];
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
    // this.filterRoomsByDate();
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


  filterRoomsByDate() {
    this.tableLoaded = false;
    // filtrowanie
    this.tableLoaded = true;
  }

  checkRoomDetails(rowData: any) {
    this.chosenRoom.emit(rowData);
  }
}
