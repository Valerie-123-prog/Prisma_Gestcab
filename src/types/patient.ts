
export interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  gender: 'male' | 'female' | 'other';
  phone: string;
  email?: string;
  address?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
  medicalHistory?: string;
  allergies?: string;
  currentMedications?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface MedicalRecord {
  id: string;
  patientId: string;
  consultations: Consultation[];
  treatments: Treatment[];
  documents: Document[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Consultation {
  id: string;
  date: Date;
  reason: string;
  symptoms: string;
  diagnosis: string;
  prescription: string;
  notes: string;
  doctorName: string;
}

export interface Treatment {
  id: string;
  medication: string;
  dosage: string;
  frequency: string;
  duration: string;
  startDate: Date;
  endDate?: Date;
  instructions: string;
}

export interface Document {
  id: string;
  name: string;
  type: string;
  url: string;
  uploadedAt: Date;
}
