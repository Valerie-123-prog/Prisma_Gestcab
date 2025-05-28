
import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
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
    <div className="max-h-[80vh] overflow-y-auto pr-2">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Informations du centre */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-blue-600">
              Informations du Centre Médical
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="clinicName" className="text-sm font-medium">
                  Nom du centre <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="clinicName"
                  {...register('clinicName', { required: 'Le nom du centre est requis' })}
                  placeholder="Ex: Centre Médical Central"
                  className="w-full"
                />
                {errors.clinicName && (
                  <p className="text-sm text-red-600">{errors.clinicName.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="clinicEmail" className="text-sm font-medium">
                  Email du centre
                </Label>
                <Input
                  id="clinicEmail"
                  type="email"
                  {...register('clinicEmail')}
                  placeholder="contact@centre.cm"
                  className="w-full"
                />
                {errors.clinicEmail && (
                  <p className="text-sm text-red-600">{errors.clinicEmail.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="clinicAddress" className="text-sm font-medium">
                Adresse complète <span className="text-red-500">*</span>
              </Label>
              <Input
                id="clinicAddress"
                {...register('clinicAddress', { required: 'L\'adresse est requise' })}
                placeholder="Quartier, Ville, Région, Cameroun"
                className="w-full"
              />
              {errors.clinicAddress && (
                <p className="text-sm text-red-600">{errors.clinicAddress.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="clinicPhone" className="text-sm font-medium">
                Téléphone <span className="text-red-500">*</span>
              </Label>
              <Input
                id="clinicPhone"
                {...register('clinicPhone', { 
                  required: 'Le téléphone est requis',
                  pattern: {
                    value: /^\+237[67]\d{8}$/,
                    message: 'Format requis: +237 6XX XXX XXX ou +237 7XX XXX XXX'
                  }
                })}
                placeholder="+237 6XX XXX XXX"
                className="w-full"
              />
              {errors.clinicPhone && (
                <p className="text-sm text-red-600">{errors.clinicPhone.message}</p>
              )}
              <p className="text-xs text-gray-500">
                Format: +237 6XX XXX XXX (Orange/MTN) ou +237 7XX XXX XXX
              </p>
            </div>
          </CardContent>
        </Card>

        <Separator className="my-6" />

        {/* Paramètres de facturation */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-green-600">
              Configuration de la Facturation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="defaultConsultationPrice" className="text-sm font-medium">
                  Prix consultation par défaut <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Input
                    id="defaultConsultationPrice"
                    type="number"
                    min="0"
                    step="500"
                    {...register('defaultConsultationPrice', { 
                      required: 'Le prix par défaut est requis',
                      min: { value: 0, message: 'Le prix doit être supérieur ou égal à 0' },
                      valueAsNumber: true
                    })}
                    placeholder="15000"
                    className="w-full pr-16"
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-500">
                    FCFA
                  </span>
                </div>
                {errors.defaultConsultationPrice && (
                  <p className="text-sm text-red-600">{errors.defaultConsultationPrice.message}</p>
                )}
                <p className="text-xs text-gray-500">
                  Ce prix sera utilisé par défaut pour les nouvelles consultations
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="nextInvoiceNumber" className="text-sm font-medium">
                  Prochain numéro de facture <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="nextInvoiceNumber"
                  type="number"
                  min="1"
                  {...register('nextInvoiceNumber', { 
                    required: 'Le numéro est requis',
                    min: { value: 1, message: 'Le numéro doit être supérieur à 0' },
                    valueAsNumber: true
                  })}
                  placeholder="1"
                  className="w-full"
                />
                {errors.nextInvoiceNumber && (
                  <p className="text-sm text-red-600">{errors.nextInvoiceNumber.message}</p>
                )}
                <p className="text-xs text-gray-500">
                  Numéro qui sera attribué à la prochaine facture créée
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="invoicePrefix" className="text-sm font-medium">
                Préfixe des factures <span className="text-red-500">*</span>
              </Label>
              <Input
                id="invoicePrefix"
                {...register('invoicePrefix', { 
                  required: 'Le préfixe est requis',
                  maxLength: { value: 10, message: 'Le préfixe ne peut pas dépasser 10 caractères' }
                })}
                placeholder="FAC"
                className="w-full max-w-xs"
              />
              {errors.invoicePrefix && (
                <p className="text-sm text-red-600">{errors.invoicePrefix.message}</p>
              )}
              <p className="text-xs text-gray-500">
                Exemple: avec "FAC" et numéro 1, la facture sera "FAC-0001"
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-end space-x-3 pt-6 border-t">
          <Button type="button" variant="outline" onClick={onSuccess} className="px-6">
            Annuler
          </Button>
          <Button type="submit" className="px-6 bg-blue-600 hover:bg-blue-700">
            Enregistrer les paramètres
          </Button>
        </div>
      </form>
    </div>
  );
};
