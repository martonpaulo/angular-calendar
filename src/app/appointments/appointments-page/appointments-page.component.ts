import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Appointment } from '../appointment';
import { AppointmentsService } from '../appointments.service';
import { MatDialog } from '@angular/material/dialog';
import { AppointmentFormComponent } from '../appointment-form/appointment-form.component';
import { CdkDragDrop, transferArrayItem } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-appointments-page',
  templateUrl: './appointments-page.component.html',
  styleUrls: ['./appointments-page.component.css'],
})
export class AppointmentsPageComponent implements OnInit {
  appointments: Appointment[] = [];
  appointmentsForHour: Appointment[][] = [];
  pageTitle = '';
  year = 0;
  month = 0;
  day = 0;

  hoursOfDay = Array.from({ length: 24 }, (_, i) => i).map((hour) => hour);

  constructor(
    private appointmentsService: AppointmentsService,
    private route: ActivatedRoute,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    const yearParam = this.route.snapshot.paramMap.get('year');
    const monthParam = this.route.snapshot.paramMap.get('month');
    const dayParam = this.route.snapshot.paramMap.get('day');

    if (yearParam !== null) {
      this.year = +yearParam;
    }

    if (monthParam !== null) {
      this.month = +monthParam;
    }

    if (dayParam !== null) {
      this.day = +dayParam;
    }

    const monthName = new Date(this.year, this.month - 1).toLocaleString(
      'default',
      {
        month: 'long',
      }
    );

    this.pageTitle = `${monthName} ${this.day}, ${this.year}`;
    document.title = this.pageTitle;
    this.month--;

    this.getAppointments();
    this.getAppointmentsForHour();
  }

  goBack(): void {
    window.history.back();
  }

  isHourEmpty(hour: number): boolean {
    return this.appointmentsForHour[hour].length === 0;
  }

  getHourInString(hour: number): string {
    return hour.toString().padStart(2, '0');
  }

  getAppointmentsForHour(): void {
    this.appointmentsForHour = this.hoursOfDay.map((hour) => {
      return this.appointments.filter((appointment) => {
        const appointmentHour = Number(appointment.time?.substring(0, 2));
        return appointmentHour === hour;
      });
    });
  }

  getAppointments(): void {
    this.appointmentsService
      .getAppointments(this.year, this.month, this.day)
      .subscribe((appointments) => {
        this.appointments = appointments;
      });
  }

  editAppointment(appointment: Appointment): void {
    const dialogRef = this.dialog.open(AppointmentFormComponent, {
      width: '450px',
      data: {
        year: this.year,
        month: this.month,
        day: this.day,
        appointment: appointment,
      },
    });

    dialogRef.afterClosed().subscribe(() => {
      this.getAppointments();
      this.getAppointmentsForHour();
    });
  }

  addNewAppointment(): void {
    const dialogRef = this.dialog.open(AppointmentFormComponent, {
      width: '450px',
      data: {
        year: this.year,
        month: this.month,
        day: this.day,
      },
    });

    dialogRef.afterClosed().subscribe(() => {
      this.getAppointments();
      this.getAppointmentsForHour();
    });
  }

  drop(event: CdkDragDrop<Appointment[]>, hour: number) {
    const idToMove = event.previousContainer.data[event.previousIndex].id;

    if (event.previousContainer !== event.container) {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );

      const currentAppointment = this.appointments.find(
        (appointment) => appointment.id === idToMove
      );

      if (currentAppointment) {
        const appointment: Appointment = {
          id: idToMove,
          title: currentAppointment.title,
          description: currentAppointment.description,
          date: currentAppointment.date,
          time: hour.toString().padStart(2, '0') + ':00',
        };

        this.appointmentsService.addAppointment(appointment);
      }
    }
  }
}
