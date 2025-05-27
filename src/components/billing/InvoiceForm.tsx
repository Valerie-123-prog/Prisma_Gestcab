
import React, { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash2 } from 'lucide-react';
import { useBilling } from '@/contexts/BillingContext';
import { usePatients } from '@/contexts/PatientContext';
import { InvoiceFormData } from '@/types/billing';
import { useToast } from '@/hooks/use-toast';

interface InvoiceFormProps {
  onSuccess: () => void;
}

export const InvoiceForm: React.FC<InvoiceFormProps> = ({ onSuccess }) => {
  const { addInvoice, settings } = useBilling();
  const { patients } = usePatients();
  const { toast } = useToast();
  const [selectedPatient, setSelectedPatient] = useState<string>('');

  const { register, control, handleSubmit, watch, setValue, formState: { errors } } = useForm<InvoiceFormData>({
    defaultValues: {
      patientId: '',
      items: [{
        type: 'consultation',
        description: 'Consultation médicale',
        quantity: 1,
        unitPrice: settings.defaultConsultationPrice
      }],
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 jours
      notes: ''
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items'
  });

  const watchedItems = watch('items');

  const calculateTotal = () => {
    return watchedItems.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
  };

  const onSubmit = (data: InvoiceFormData) => {
    if (!selectedPatient) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner un patient",
        variant: "destructive",
      });
      return;
    }

    const patient = patients.find(p => p.id === selectedPatient);
    if (!patient) {
      toast({
        title: "Erreur",
        description: "Patient introuvable",
        variant: "destructive",
      });
      return;
    }

    addInvoice({
      patientId: selectedPatient,
      patientName: `${patient.firstName} ${patient.lastName}`,
      date: new Date(),
      dueDate: data.dueDate,
      items: data.items,
      status: 'unpaid',
      amountPaid: 0,
      notes: data.notes,
    });

    toast({
      title: "Succès",
      description: "Facture créée avec succès",
    });

    onSuccess();
  };

  const addItem = () => {
    append({
      type: 'other',
      description: '',
      quantity: 1,
      unitPrice: 0
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Sélection du patient */}
      <Card>
        <CardHeader>
          <CardTitle>Informations Patient</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="patient">Patient *</Label>
            <Select value={selectedPatient} onValueChange={(value) => {
              setSelectedPatient(value);
              setValue('patientId', value);
            }}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un patient" />
              </SelectTrigger>
              <SelectContent>
                {patients.map((patient) => (
                  <SelectItem key={patient.id} value={patient.id}>
                    {patient.firstName} {patient.lastName} - {patient.phone}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Articles de la facture */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Articles</CardTitle>
          <Button type="button" onClick={addItem} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Ajouter
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {fields.map((field, index) => (
            <div key={field.id} className="grid grid-cols-1 md:grid-cols-6 gap-4 p-4 border rounded-lg">
              <div>
                <Label>Type</Label>
                <Select 
                  value={watchedItems[index]?.type} 
                  onValueChange={(value) => setValue(`items.${index}.type`, value as any)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="consultation">Consultation</SelectItem>
                    <SelectItem value="medication">Médicament</SelectItem>
                    <SelectItem value="other">Autre</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="md:col-span-2">
                <Label>Description</Label>
                <Input
                  {...register(`items.${index}.description`, { required: true })}
                  placeholder="Description de l'article"
                />
              </div>

              <div>
                <Label>Quantité</Label>
                <Input
                  type="number"
                  min="1"
                  {...register(`items.${index}.quantity`, { 
                    required: true, 
                    min: 1,
                    valueAsNumber: true 
                  })}
                />
              </div>

              <div>
                <Label>Prix unitaire (FCFA)</Label>
                <Input
                  type="number"
                  min="0"
                  {...register(`items.${index}.unitPrice`, { 
                    required: true, 
                    min: 0,
                    valueAsNumber: true 
                  })}
                />
              </div>

              <div className="flex items-end">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => remove(index)}
                  disabled={fields.length === 1}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}

          {/* Total */}
          <div className="flex justify-end">
            <div className="text-right">
              <p className="text-sm text-gray-600">Total</p>
              <p className="text-2xl font-bold">{calculateTotal().toLocaleString()} FCFA</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Informations supplémentaires */}
      <Card>
        <CardHeader>
          <CardTitle>Informations Supplémentaires</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="dueDate">Date d'échéance</Label>
            <Input
              id="dueDate"
              type="date"
              {...register('dueDate', { 
                required: true,
                valueAsDate: true 
              })}
            />
          </div>

          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              {...register('notes')}
              placeholder="Notes supplémentaires..."
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onSuccess}>
          Annuler
        </Button>
        <Button type="submit">
          Créer la Facture
        </Button>
      </div>
    </form>
  );
};
