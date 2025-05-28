
export interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  gender: 'male' | 'female';
  phone: string;
  email?: string;
  address?: string;
  photo?: string;
  emergencyContact?: EmergencyContact;
  medicalHistory?: string;
  allergies?: string;
  currentMedications?: string;
  consultations: Consultation[];
  medicalRecord?: MedicalRecord;
  insuranceNumber?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface EmergencyContact {
  name: string;
  phone: string;
  relationship: string;
}

export interface PatientFormData {
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  gender: 'male' | 'female';
  phone: string;
  email: string;
  address: string;
  emergencyContact: EmergencyContact;
  medicalHistory: string;
  allergies: string;
  currentMedications: string;
  insuranceNumber: string;
}

export interface MedicalRecord {
  id: string;
  patientId: string;
  consultations: Consultation[];
  treatments: Treatment[];
  documents: Document[];
  allergies: string[];
  medicalHistory: string[];
  currentTreatments: Treatment[];
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
  notes?: string;
}

export interface Document {
  id: string;
  name: string;
  type: string;
  url: string;
  uploadedAt: Date;
}
