import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CalendarComponent } from './calendar/calendar.component';
import { RoomListComponent } from './room-list/room-list.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import {
  MatFormFieldModule,
  MAT_FORM_FIELD_DEFAULT_OPTIONS,
} from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MenuComponent } from './menu/menu.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { LoginComponent } from './login/login.component';
import { HttpClientModule } from '@angular/common/http';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ReservationComponent } from './reservation/reservation.component';
import { AdminComponent } from './admin/admin.component';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { AdminRoomListComponent } from './admin-room-list/admin-room-list.component';
import { RoomTimetableViewComponent } from './room-timetable-view/room-timetable-view.component';
import { HighlightDirective } from './directives/highlight.directive';
import { ChosenRoomComponent } from './chosen-room/chosen-room.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { AdminReservationListComponent } from './admin-reservation-list/admin-reservation-list.component';
import { AdminAddReservationComponent } from './admin-add-reservation/admin-add-reservation.component';
import { RoomListDetailsComponent } from './room-list-details/room-list-details.component';
import { TimePickerModalComponent } from './time-picker-modal/time-picker-modal.component';
import { MatDialogModule } from '@angular/material/dialog';
import { ConfirmWindowComponent } from './confirm-window/confirm-window.component';

@NgModule({
  declarations: [
    AppComponent,
    CalendarComponent,
    RoomListComponent,
    MenuComponent,
    LoginComponent,
    DashboardComponent,
    ReservationComponent,
    AdminComponent,
    AdminRoomListComponent,
    RoomTimetableViewComponent,
    HighlightDirective,
    ChosenRoomComponent,
    AdminReservationListComponent,
    AdminAddReservationComponent,
    RoomListDetailsComponent,
    TimePickerModalComponent,
    ConfirmWindowComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatCardModule,
    MatListModule,
    FormsModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatChipsModule,
    HttpClientModule,
    MatTableModule,
    MatIconModule,
    MatCheckboxModule,
    MatDialogModule,
  ],
  providers: [
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: { floatLabel: 'always' },
    },
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
