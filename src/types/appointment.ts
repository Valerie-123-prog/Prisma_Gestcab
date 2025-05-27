
export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  date: Date;
  startTime: string;
  endTime: string;
  consultationType: ConsultationType;
  status: 'scheduled' | 'completed' | 'cancelled' | 'no-show';
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
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
  appointmentId?: string;
}

export interface WorkingHours {
  dayOfWeek: number; // 0 = dimanche, 1 = lundi, etc.
  startTime: string;
  endTime: string;
  isActive: boolean;
}

export interface Holiday {
  id: string;
  date: Date;
  name: string;
  recurring: boolean; // pour les jours fériés annuels
}

export interface WaitingListEntry {
  id: string;
  patientId: string;
  patientName: string;
  preferredDate?: Date;
  consultationType: ConsultationType;
  phoneNumber: string;
  email?: string;
  createdAt: Date;
}

export interface NotificationSettings {
  emailEnabled: boolean;
  smsEnabled: boolean;
  reminderHours: number; // heures avant le RDV
}
