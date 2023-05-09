import { Component, EventEmitter, Inject, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Appointment } from '../appointment';
import { AppointmentsService } from '../appointments.service';
import { AppointmentFormData } from '../appointment-form-data';

@Component({
  selector: 'app-appointment-form',
  templateUrl: './appointment-form.component.html',
  styleUrls: ['./appointment-form.component.css'],
})
export class AppointmentFormComponent {
  @Output() addAppointment = new EventEmitter<Appointment>();
  appointmentForm: FormGroup;
  currentDate: string;
  id = 0;

  constructor(
    private dialogRef: MatDialogRef<AppointmentFormComponent>,
    private formBuilder: FormBuilder,
    private appointmentsService: AppointmentsService,
    @Inject(MAT_DIALOG_DATA) public data: AppointmentFormData
  ) {
    this.currentDate = new Date(data.year, data.month, data.day).toISOString();

    this.id = data.appointment?.id || 0;

    const title = data.appointment?.title || '';
    const description = data.appointment?.description || '';
    const date = data.appointment?.date || this.currentDate;
    const time = data.appointment?.time || null;

    this.appointmentForm = this.formBuilder.group({
      title: [title, Validators.required],
      description: [description],
      date: [date, Validators.required],
      time: [time, Validators.required],
    });
  }

  onSubmit(): void {
    if (this.appointmentForm.valid) {
      const appointment: Appointment = {
        id: this.id === 0 ? Math.floor(Math.random() * 1000) + 1 : this.id,
        ...this.appointmentForm.value,
      };
      this.appointmentsService.addAppointment(appointment);
      this.appointmentForm.reset();
      this.dialogRef.close();
    }
  }

  removeAppointment(): void {
    this.appointmentsService.removeAppointment(this.id);
    this.appointmentForm.reset();
    this.dialogRef.close();
  }
}
