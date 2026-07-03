
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Patient, Consultation, Treatment } from '@/types/patient';
import { loadFromStorage, saveToStorage } from '@/lib/storage';

interface PatientContextType {
  patients: Patient[];
  addPatient: (patient: Omit<Patient, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updatePatient: (id: string, patient: Partial<Patient>) => void;
  deletePatient: (id: string) => void;
  getPatient: (id: string) => Patient | undefined;
  addConsultation: (patientId: string, consultation: Omit<Consultation, 'id'>) => void;
  addTreatment: (patientId: string, treatment: Omit<Treatment, 'id'>) => void;
  searchPatients: (query: string) => Patient[];
}

const PatientContext = createContext<PatientContextType | undefined>(undefined);

export const usePatients = () => {
  const context = useContext(PatientContext);
  if (!context) {
    throw new Error('usePatients must be used within a PatientProvider');
  }
  return context;
};

export const PatientProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [patients, setPatients] = useState<Patient[]>([]);

  // Charger les données depuis localStorage au démarrage
  useEffect(() => {
    const savedPatients = loadFromStorage<Patient[]>(
      'patients',
      ['dateOfBirth', 'date', 'startDate', 'endDate', 'createdAt', 'updatedAt']
    );
    if (savedPatients) setPatients(savedPatients);
  }, []);

  // Sauvegarder dans localStorage à chaque changement
  useEffect(() => {
    saveToStorage('patients', patients);
  }, [patients]);

  const addPatient = (patientData: Omit<Patient, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newPatient: Patient = {
      ...patientData,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setPatients(prev => [...prev, newPatient]);
  };

  const updatePatient = (id: string, updates: Partial<Patient>) => {
    setPatients(prev => prev.map(patient => 
      patient.id === id 
        ? { ...patient, ...updates, updatedAt: new Date() }
        : patient
    ));
  };

  const deletePatient = (id: string) => {
    setPatients(prev => prev.filter(patient => patient.id !== id));
  };

  const getPatient = (id: string) => {
    return patients.find(patient => patient.id === id);
  };

  const addConsultation = (patientId: string, consultationData: Omit<Consultation, 'id'>) => {
    const newConsultation: Consultation = {
      ...consultationData,
      id: crypto.randomUUID(),
    };
    
    updatePatient(patientId, {
      consultations: [
        ...(getPatient(patientId)?.consultations || []),
        newConsultation
      ]
    });
  };

  const addTreatment = (patientId: string, treatmentData: Omit<Treatment, 'id'>) => {
    const newTreatment: Treatment = {
      ...treatmentData,
      id: crypto.randomUUID(),
    };
    
    const patient = getPatient(patientId);
    if (patient) {
      updatePatient(patientId, {
        medicalRecord: {
          ...patient.medicalRecord,
          currentTreatments: [...patient.medicalRecord.currentTreatments, newTreatment]
        }
      });
    }
  };

  const searchPatients = (query: string): Patient[] => {
    if (!query.trim()) return patients;
    
    const lowercaseQuery = query.toLowerCase();
    return patients.filter(patient => 
      patient.firstName.toLowerCase().includes(lowercaseQuery) ||
      patient.lastName.toLowerCase().includes(lowercaseQuery) ||
      patient.phone.includes(query) ||
      patient.email?.toLowerCase().includes(lowercaseQuery)
    );
  };

  const value: PatientContextType = {
    patients,
    addPatient,
    updatePatient,
    deletePatient,
    getPatient,
    addConsultation,
    addTreatment,
    searchPatients,
  };

  return (
    <PatientContext.Provider value={value}>
      {children}
    </PatientContext.Provider>
  );
};
