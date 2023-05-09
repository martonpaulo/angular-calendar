import { Appointment } from "./appointment";

export interface AppointmentFormData {
  year: number;
  month: number;
  day: number;
  appointment?: Appointment;
}