import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { Appointment } from './appointment';

@Injectable({
  providedIn: 'root',
})
export class AppointmentsService {
  private readonly STORAGE_KEY = 'appointments';
  private readonly appointmentsSubject = new BehaviorSubject<Appointment[]>([]);

  constructor() {
    this.loadAppointments();
  }

  getAppointments(
    year: number,
    month: number,
    day: number
  ): Observable<Appointment[]> {
    const appointments = this.appointmentsSubject.getValue().filter((a) => {
      const appointmentDate = new Date(a.date);
      return (
        appointmentDate.getFullYear() === year &&
        appointmentDate.getMonth() === month &&
        appointmentDate.getDate() === day
      );
    });
    return of(appointments);
  }

  addAppointment(appointment: Appointment): void {
    const appointments = this.appointmentsSubject.getValue().map((a) => {
      if (a.id === appointment.id) {
        return { ...a, ...appointment };
      }
      return a;
    });
    if (!appointments.some((a) => a.id === appointment.id)) {
      appointments.push(appointment);
    }
    this.updateAppointments(appointments);
  }

  removeAppointment(id: number): void {
    const appointments = this.appointmentsSubject
      .getValue()
      .filter((a) => a.id !== id);
    this.updateAppointments(appointments);
  }

  private updateAppointments(appointments: Appointment[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(appointments));
    this.appointmentsSubject.next(appointments);
  }

  private loadAppointments(): void {
    const appointments = JSON.parse(
      localStorage.getItem(this.STORAGE_KEY) || '[]'
    ) as Appointment[];
    this.appointmentsSubject.next(appointments);
  }
}
