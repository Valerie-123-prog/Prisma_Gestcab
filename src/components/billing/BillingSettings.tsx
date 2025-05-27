
import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { BillingSettings as BillingSettingsType } from '@/types/billing';
import { useBilling } from '@/contexts/BillingContext';
import { useToast } from '@/hooks/use-toast';

interface BillingSettingsProps {
  onSuccess: () => void;
}

export const BillingSettings: React.FC<BillingSettingsProps> = ({ onSuccess }) => {
  const { settings, updateSettings } = useBilling();
  const { toast } = useToast();

  const { register, handleSubmit, formState: { errors } } = useForm<BillingSettingsType>({
    defaultValues: settings
  });

  const onSubmit = (data: BillingSettingsType) => {
    updateSettings(data);
    
    toast({
      title: "Succès",
      description: "Paramètres mis à jour avec succès",
    });

    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Informations du centre */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Informations du Centre</h3>
        
        <div>
          <Label htmlFor="clinicName">Nom du centre *</Label>
          <Input
            id="clinicName"
            {...register('clinicName', { required: 'Le nom du centre est requis' })}
          />
          {errors.clinicName && (
            <p className="text-sm text-red-600 mt-1">{errors.clinicName.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="clinicAddress">Adresse *</Label>
          <Input
            id="clinicAddress"
            {...register('clinicAddress', { required: 'L\'adresse est requise' })}
          />
          {errors.clinicAddress && (
            <p className="text-sm text-red-600 mt-1">{errors.clinicAddress.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="clinicPhone">Téléphone *</Label>
          <Input
            id="clinicPhone"
            {...register('clinicPhone', { required: 'Le téléphone est requis' })}
          />
          {errors.clinicPhone && (
            <p className="text-sm text-red-600 mt-1">{errors.clinicPhone.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="clinicEmail">Email</Label>
          <Input
            id="clinicEmail"
            type="email"
            {...register('clinicEmail')}
          />
        </div>
      </div>

      {/* Paramètres de facturation */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Paramètres de Facturation</h3>
        
        <div>
          <Label htmlFor="defaultConsultationPrice">Prix consultation par défaut (FCFA) *</Label>
          <Input
            id="defaultConsultationPrice"
            type="number"
            min="0"
            {...register('defaultConsultationPrice', { 
              required: 'Le prix par défaut est requis',
              min: { value: 0, message: 'Le prix doit être supérieur ou égal à 0' },
              valueAsNumber: true
            })}
          />
          {errors.defaultConsultationPrice && (
            <p className="text-sm text-red-600 mt-1">{errors.defaultConsultationPrice.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="invoicePrefix">Préfixe des factures *</Label>
          <Input
            id="invoicePrefix"
            {...register('invoicePrefix', { required: 'Le préfixe est requis' })}
          />
          {errors.invoicePrefix && (
            <p className="text-sm text-red-600 mt-1">{errors.invoicePrefix.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="nextInvoiceNumber">Prochain numéro de facture *</Label>
          <Input
            id="nextInvoiceNumber"
            type="number"
            min="1"
            {...register('nextInvoiceNumber', { 
              required: 'Le numéro est requis',
              min: { value: 1, message: 'Le numéro doit être supérieur à 0' },
              valueAsNumber: true
            })}
          />
          {errors.nextInvoiceNumber && (
            <p className="text-sm text-red-600 mt-1">{errors.nextInvoiceNumber.message}</p>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onSuccess}>
          Annuler
        </Button>
        <Button type="submit">
          Enregistrer
        </Button>
      </div>
    </form>
  );
};
