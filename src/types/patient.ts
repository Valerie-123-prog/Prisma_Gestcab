
export interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  gender: 'male' | 'female' | 'other';
  address: string;
  phone: string;
  email?: string;
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
  insuranceNumber?: string;
  photo?: string;
  medicalRecord: MedicalRecord;
  consultations: Consultation[];
  createdAt: Date;
  updatedAt: Date;
}

export interface MedicalRecord {
  allergies: string[];
  medicalHistory: string[];
  currentTreatments: Treatment[];
}

export interface Treatment {
  id: string;
  medication: string;
  dosage: string;
  frequency: string;
  startDate: Date;
  endDate?: Date;
  notes?: string;
}

export interface Consultation {
  id: string;
  date: Date;
  diagnosis: string;
  prescription: string;
  notes?: string;
  doctorName: string;
}

export interface PatientFormData {
  firstName: string;
  lastName: string;
  dateOfBirth: Date | undefined;
  gender: 'male' | 'female' | 'other';
  address: string;
  phone: string;
  email: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  emergencyContactRelationship: string;
  insuranceNumber: string;
}
