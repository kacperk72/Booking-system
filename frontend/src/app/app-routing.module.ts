import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin/admin.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { RoomTimetableViewComponent } from './room-timetable-view/room-timetable-view.component';
import { AdminAddReservationComponent } from './admin-add-reservation/admin-add-reservation.component';

const routes: Routes = [
  { path: 'dashboard', component: DashboardComponent },
  { path: 'logowanie', component: LoginComponent },
  { path: 'admin', component: AdminComponent },
  { path: 'admin-rezerwacja', component: AdminAddReservationComponent },
  { path: 'room/:roomName/:id', component: RoomTimetableViewComponent },
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
