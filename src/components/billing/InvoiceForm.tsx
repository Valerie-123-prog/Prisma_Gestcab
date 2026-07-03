import React, { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Plus, Trash2, Check, ChevronsUpDown } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { InvoiceFormData, InvoiceItem } from '@/types/billing';
import { useBilling } from '@/contexts/BillingContext';
import { usePatients } from '@/contexts/PatientContext';
import { useToast } from '@/hooks/use-toast';

interface InvoiceFormProps {
  onSuccess: () => void;
}

export const InvoiceForm: React.FC<InvoiceFormProps> = ({ onSuccess }) => {
  const { addInvoice } = useBilling();
  const { patients } = usePatients();
  const { toast } = useToast();
  const [selectedPatient, setSelectedPatient] = useState<string>('');
  const [patientSearchOpen, setPatientSearchOpen] = useState(false);
  const [dueDate, setDueDate] = useState<Date>(new Date());

  const { register, handleSubmit, control, formState: { errors }, setValue, watch } = useForm<InvoiceFormData>({
    defaultValues: {
      patientId: '',
      items: [{ type: 'consultation', description: 'Consultation générale', quantity: 1, unitPrice: 15000 }],
      notes: ''
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items'
  });

  const watchedItems = watch('items');

  const calculateItemTotal = (index: number) => {
    const item = watchedItems[index];
    return (item?.quantity || 0) * (item?.unitPrice || 0);
  };

  const calculateSubtotal = () => {
    return watchedItems.reduce((sum, item) => sum + ((item?.quantity || 0) * (item?.unitPrice || 0)), 0);
  };

  const addItem = () => {
    append({ type: 'other', description: '', quantity: 1, unitPrice: 0 });
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

    // Transform the form data to match the expected type
    const invoiceItems: InvoiceItem[] = data.items.map((item, index) => ({
      id: crypto.randomUUID(),
      type: item.type,
      description: item.description,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      total: calculateItemTotal(index)
    }));

    const invoiceData = {
      ...data,
      patientId: selectedPatient,
      items: invoiceItems,
      date: new Date(),
      dueDate: dueDate,
    };

    addInvoice(invoiceData);
    
    toast({
      title: "Succès",
      description: "Facture créée avec succès",
    });

    onSuccess();
  };

  const selectedPatientData = patients.find(p => p.id === selectedPatient);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Patient Selection */}
      <div className="space-y-2">
        <Label>Patient *</Label>
        <Popover open={patientSearchOpen} onOpenChange={setPatientSearchOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={patientSearchOpen}
              className="w-full justify-between"
            >
              {selectedPatientData
                ? `${selectedPatientData.firstName} ${selectedPatientData.lastName}`
                : "Sélectionner un patient..."}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0">
            <Command>
              <CommandInput placeholder="Rechercher un patient..." />
              <CommandList>
                <CommandEmpty>Aucun patient trouvé.</CommandEmpty>
                <CommandGroup>
                  {patients.map((patient) => (
                    <CommandItem
                      key={patient.id}
                      value={`${patient.firstName} ${patient.lastName}`}
                      onSelect={() => {
                        setSelectedPatient(patient.id);
                        setValue('patientId', patient.id);
                        setPatientSearchOpen(false);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          selectedPatient === patient.id ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {patient.firstName} {patient.lastName}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      {/* Due Date */}
      <div className="space-y-2">
        <Label>Date d'échéance *</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !dueDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dueDate ? format(dueDate, "PPP", { locale: fr }) : "Sélectionner une date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={dueDate}
              onSelect={(date) => date && setDueDate(date)}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* Invoice Items */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Label className="text-lg font-semibold">Articles</Label>
          <Button type="button" onClick={addItem} size="sm">
            <Plus className="h-4 w-4 mr-1" />
            Ajouter
          </Button>
        </div>

        {fields.map((field, index) => (
          <Card key={field.id}>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                <div>
                  <Label>Type</Label>
                  <Select
                    value={watchedItems[index]?.type || 'other'}
                    onValueChange={(value) => setValue(`items.${index}.type`, value as InvoiceItem['type'])}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="consultation">Consultation</SelectItem>
                      <SelectItem value="medication">Médicament</SelectItem>
                      <SelectItem value="analysis">Analyse</SelectItem>
                      <SelectItem value="medical_act">Acte médical</SelectItem>
                      <SelectItem value="other">Autre</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="md:col-span-2">
                  <Label>Description</Label>
                  <Input
                    {...register(`items.${index}.description`, { required: 'Description requise' })}
                    placeholder="Description de l'article"
                  />
                </div>

                <div>
                  <Label>Quantité</Label>
                  <Input
                    type="number"
                    min="1"
                    {...register(`items.${index}.quantity`, { 
                      required: 'Quantité requise',
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
                      required: 'Prix requis',
                      min: 0,
                      valueAsNumber: true 
                    })}
                  />
                </div>

                <div className="flex items-end">
                  <div className="space-y-2 flex-1">
                    <Label>Total</Label>
                    <div className="text-lg font-semibold text-green-600">
                      {calculateItemTotal(index).toLocaleString()} FCFA
                    </div>
                  </div>
                  {fields.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => remove(index)}
                      className="ml-2"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Total */}
        <Card>
          <CardContent className="pt-6">
            <div className="text-right">
              <div className="text-xl font-bold text-green-600">
                Total: {calculateSubtotal().toLocaleString()} FCFA
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Notes */}
      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          {...register('notes')}
          placeholder="Notes additionnelles..."
          rows={3}
        />
      </div>

      {/* Actions */}
      <div className="flex justify-end space-x-2 pt-4">
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
