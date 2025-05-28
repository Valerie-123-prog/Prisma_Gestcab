
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { usePatients } from '@/contexts/PatientContext';
import { PatientFormData } from '@/types/patient';
import { useToast } from '@/hooks/use-toast';
import { PersonalInfoSection } from './forms/PersonalInfoSection';
import { EmergencyContactSection } from './forms/EmergencyContactSection';
import { MedicalHistorySection } from './forms/MedicalHistorySection';
import { patientSchema } from './forms/PatientFormData';

interface PatientFormProps {
  onSuccess: () => void;
  initialData?: Partial<PatientFormData>;
  patientId?: string;
}

export const PatientForm: React.FC<PatientFormProps> = ({ 
  onSuccess, 
  initialData,
  patientId 
}) => {
  const { addPatient, updatePatient } = usePatients();
  const { toast } = useToast();
  
  const form = useForm<PatientFormData>({
    resolver: zodResolver(patientSchema),
    defaultValues: {
      firstName: initialData?.firstName || '',
      lastName: initialData?.lastName || '',
      dateOfBirth: initialData?.dateOfBirth,
      gender: initialData?.gender || 'male',
      address: initialData?.address || '',
      phone: initialData?.phone || '',
      email: initialData?.email || '',
      emergencyContact: {
        name: initialData?.emergencyContact?.name || '',
        phone: initialData?.emergencyContact?.phone || '',
        relationship: initialData?.emergencyContact?.relationship || '',
      },
      medicalHistory: initialData?.medicalHistory || '',
      allergies: initialData?.allergies || '',
      currentMedications: initialData?.currentMedications || '',
      insuranceNumber: initialData?.insuranceNumber || '',
    },
  });

  const onSubmit = (data: PatientFormData) => {
    try {
      if (patientId) {
        // Mode modification
        updatePatient(patientId, {
          firstName: data.firstName,
          lastName: data.lastName,
          dateOfBirth: data.dateOfBirth!,
          gender: data.gender,
          address: data.address,
          phone: data.phone,
          email: data.email || undefined,
          emergencyContact: data.emergencyContact,
          medicalHistory: data.medicalHistory,
          allergies: data.allergies,
          currentMedications: data.currentMedications,
          insuranceNumber: data.insuranceNumber || undefined,
        });
        
        toast({
          title: "Patient modifié",
          description: "Les informations du patient ont été mises à jour avec succès.",
        });
      } else {
        // Mode ajout - Fix the medical record structure
        addPatient({
          firstName: data.firstName,
          lastName: data.lastName,
          dateOfBirth: data.dateOfBirth!,
          gender: data.gender,
          address: data.address,
          phone: data.phone,
          email: data.email || undefined,
          emergencyContact: data.emergencyContact,
          medicalHistory: data.medicalHistory,
          allergies: data.allergies,
          currentMedications: data.currentMedications,
          insuranceNumber: data.insuranceNumber || undefined,
          medicalRecord: {
            id: crypto.randomUUID(),
            patientId: '', // Will be set by the context
            consultations: [],
            treatments: [],
            documents: [],
            allergies: data.allergies ? [data.allergies] : [],
            medicalHistory: data.medicalHistory ? [data.medicalHistory] : [],
            currentTreatments: [],
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          consultations: [],
        });
        
        toast({
          title: "Patient ajouté",
          description: "Le nouveau patient a été enregistré avec succès.",
        });
      }
      
      onSuccess();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'enregistrement.",
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <PersonalInfoSection form={form} />
      <EmergencyContactSection form={form} />
      <MedicalHistorySection form={form} />

      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onSuccess}>
          Annuler
        </Button>
        <Button type="submit">
          {patientId ? 'Modifier' : 'Ajouter'} le patient
        </Button>
      </div>
    </form>
  );
};
