
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { PatientFormData } from '@/types/patient';

interface MedicalHistorySectionProps {
  form: UseFormReturn<PatientFormData>;
}

export const MedicalHistorySection: React.FC<MedicalHistorySectionProps> = ({ form }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Historique médical</h3>
      
      <div>
        <Label htmlFor="medicalHistory">Antécédents médicaux</Label>
        <Textarea
          id="medicalHistory"
          {...form.register('medicalHistory')}
          className="mt-1"
          rows={3}
          placeholder="Antécédents médicaux du patient..."
        />
      </div>

      <div>
        <Label htmlFor="allergies">Allergies</Label>
        <Textarea
          id="allergies"
          {...form.register('allergies')}
          className="mt-1"
          rows={2}
          placeholder="Allergies connues..."
        />
      </div>

      <div>
        <Label htmlFor="currentMedications">Médicaments actuels</Label>
        <Textarea
          id="currentMedications"
          {...form.register('currentMedications')}
          className="mt-1"
          rows={2}
          placeholder="Médicaments en cours..."
        />
      </div>
      
      <div>
        <Label htmlFor="insuranceNumber">Numéro d'assurance</Label>
        <Input
          id="insuranceNumber"
          {...form.register('insuranceNumber')}
          className="mt-1"
        />
      </div>
    </div>
  );
};
