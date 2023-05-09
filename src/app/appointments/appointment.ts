export interface Appointment {
  id: number;
  title: string;
  description: string;
  date: Date;
  time: string;
}

export interface AppointmentsResponse {
  data: Appointment[];
}
