
export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  date: Date;
  startTime: string;
  endTime: string;
  consultationType: ConsultationType;
  status: 'scheduled' | 'completed' | 'cancelled' | 'confirmed' | 'no-show';
  reason?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AppointmentFormData {
  patientId: string;
  date: Date;
  startTime: string;
  consultationTypeId: string;
  notes: string;
}

export interface ConsultationType {
  id: string;
  name: string;
  duration: number; // en minutes
  color: string;
  price?: number;
}

export interface TimeSlot {
  start: string;
  end: string;
  available: boolean;
}

export interface WorkingHours {
  day: number; // 0-6 (dimanche-samedi)
  startTime: string;
  endTime: string;
  isWorking: boolean;
}

export interface Holiday {
  id: string;
  date: Date;
  name: string;
  recurring: boolean;
}

export interface WaitingListEntry {
  id: string;
  patientId: string;
  patientName: string;
  phoneNumber: string;
  consultationType: ConsultationType;
  preferredDates: Date[];
  createdAt: Date;
}
