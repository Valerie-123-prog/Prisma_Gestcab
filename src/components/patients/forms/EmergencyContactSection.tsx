
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PatientFormData } from '@/types/patient';
import { relationshipOptions } from './PatientFormData';

interface EmergencyContactSectionProps {
  form: UseFormReturn<PatientFormData>;
}

export const EmergencyContactSection: React.FC<EmergencyContactSectionProps> = ({ form }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Contact d'urgence</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="emergencyContactName">Nom du contact *</Label>
          <Input
            id="emergencyContactName"
            {...form.register('emergencyContact.name')}
            className="mt-1"
          />
          {form.formState.errors.emergencyContact?.name && (
            <p className="text-sm text-red-600 mt-1">
              {form.formState.errors.emergencyContact.name.message}
            </p>
          )}
        </div>
        
        <div>
          <Label htmlFor="emergencyContactPhone">Téléphone du contact *</Label>
          <Input
            id="emergencyContactPhone"
            {...form.register('emergencyContact.phone')}
            className="mt-1"
          />
          {form.formState.errors.emergencyContact?.phone && (
            <p className="text-sm text-red-600 mt-1">
              {form.formState.errors.emergencyContact.phone.message}
            </p>
          )}
        </div>
      </div>

      <div>
        <Label htmlFor="emergencyContactRelationship">Relation *</Label>
        <Select
          value={form.watch('emergencyContact.relationship')}
          onValueChange={(value) => form.setValue('emergencyContact.relationship', value)}
        >
          <SelectTrigger className="mt-1">
            <SelectValue placeholder="Sélectionner une relation" />
          </SelectTrigger>
          <SelectContent>
            {relationshipOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {form.formState.errors.emergencyContact?.relationship && (
          <p className="text-sm text-red-600 mt-1">
            {form.formState.errors.emergencyContact.relationship.message}
          </p>
        )}
      </div>
    </div>
  );
};
