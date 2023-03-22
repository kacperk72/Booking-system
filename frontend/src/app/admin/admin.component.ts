import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, Subscription, tap } from 'rxjs';
import { AdminService } from '../admin.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
})
export class AdminComponent {
  // elementData$: Observable<any> = this.adminService.getDoctorsData().pipe(
  //   tap((elem) => {
  //     this.isLoaded = true;
  //   })
  // );

  addReservationForm!: FormGroup;
  displayedColumns: string[] = [
    'id_lekarza',
    'name',
    'surname',
    'speciality',
    'city',
    'icons',
  ];
  isVisibleAdd = true;
  isLoaded = false;

  doctorData = {};
  userId = '';
  role = 'lekarz';
  userName!: string;
  userSurname!: string;
  userLogin!: string;
  userPassword!: string;
  city!: string;
  speciality!: string;
  doctorDataJson: any;

  editPanel = false;

  private subaddDoctor$!: Subscription;
  private subdeleteDoctor$!: Subscription;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private adminService: AdminService
  ) {}

  ngOnInit(): void {
    this.addReservationForm = this.fb.group({
      name: [this.userName, Validators.required],
      surname: [this.userSurname, Validators.required],
      login: [this.userLogin, [Validators.required, Validators.minLength(3)]],
      password: [
        this.userPassword,
        [Validators.required, Validators.minLength(4)],
      ],
      city: [this.city, Validators.required],
      speciality: [this.speciality, Validators.required],
    });
  }

  ngOnDestroy(): void {
    if (!!this.subdeleteDoctor$) {
      this.subdeleteDoctor$.unsubscribe();
    }
    if (!!this.subaddDoctor$) {
      this.subaddDoctor$.unsubscribe();
    }
  }

  addReservation(): void {
    this.isVisibleAdd = !this.isVisibleAdd;
  }

  addReservationDB(): void {
    if (this.isVisibleAdd === true) {
      this.isVisibleAdd = false;
    } else {
      this.isVisibleAdd = true;
    }
    this.userName = this.addReservationForm.get('name')?.value;
    this.userSurname = this.addReservationForm.get('surname')?.value;
    this.userLogin = this.addReservationForm.get('login')?.value;
    this.userPassword = this.addReservationForm.get('password')?.value;
    this.city = this.addReservationForm.get('city')?.value;
    this.speciality = this.addReservationForm.get('speciality')?.value;

    this.doctorData = {
      id: this.userId,
      name: this.userName,
      surname: this.userSurname,
      login: this.userLogin,
      password: this.userPassword,
      role: this.role,
      city: this.city,
      speciality: this.speciality,
    };

    // this.subaddDoctor$ = this.adminService
    //   .addDoctor(this.doctorData)
    //   .subscribe((response: any) => {
    //     console.log(response);
    //   });

    window.location.reload();
  }

  openEditPanel(element: any): void {
    const idLek = element.user_id;
    const spec = element.speciality.join();
    const city = element.city;
    const login = element.login;
    const name = element.name;
    const surname = element.surname;

    this.router.navigate([
      '/adminEditDoctor',
      idLek,
      spec,
      city,
      login,
      name,
      surname,
    ]);
  }

  deleteDoctor(element: any): void {
    const idLek = element.user_id;

    // if (window.confirm('Napewno chcesz usunąć?')) {
    //   this.subdeleteDoctor$ = this.adminService
    //     .deleteDoctor(idLek)
    //     .subscribe((resp: any) => {
    //       console.log('delete succesfulLy', resp);
    //     });
    // }

    window.location.reload();
  }
}
