
export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  date: Date;
  time: string;
  type: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'confirmed' | 'no-show';
  reason?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AppointmentFormData {
  patientId: string;
  date: Date;
  time: string;
  type: string;
  reason: string;
  notes: string;
}
