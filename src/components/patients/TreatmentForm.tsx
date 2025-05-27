
import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { Treatment } from '@/types/patient';
import { usePatients } from '@/contexts/PatientContext';
import { useToast } from '@/hooks/use-toast';

interface TreatmentFormProps {
  patientId: string;
  onSuccess: () => void;
}

export const TreatmentForm: React.FC<TreatmentFormProps> = ({ patientId, onSuccess }) => {
  const { addTreatment } = usePatients();
  const { toast } = useToast();
  const [startDate, setStartDate] = React.useState<Date>(new Date());
  const [endDate, setEndDate] = React.useState<Date | undefined>();

  const { register, handleSubmit, formState: { errors }, setValue } = useForm<Omit<Treatment, 'id'>>({
    defaultValues: {
      medication: '',
      dosage: '',
      frequency: '',
      duration: '',
      startDate: new Date(),
      instructions: ''
    }
  });

  const onSubmit = (data: Omit<Treatment, 'id'>) => {
    const treatmentData = {
      ...data,
      startDate,
      endDate
    };

    addTreatment(patientId, treatmentData);
    
    toast({
      title: "Succès",
      description: "Traitement ajouté avec succès",
    });

    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Medication */}
      <div className="space-y-2">
        <Label htmlFor="medication">Médicament *</Label>
        <Input
          id="medication"
          {...register('medication', { required: 'Le médicament est requis' })}
          placeholder="Nom du médicament"
        />
        {errors.medication && (
          <p className="text-sm text-red-600">{errors.medication.message}</p>
        )}
      </div>

      {/* Dosage */}
      <div className="space-y-2">
        <Label htmlFor="dosage">Dosage *</Label>
        <Input
          id="dosage"
          {...register('dosage', { required: 'Le dosage est requis' })}
          placeholder="Ex: 500mg, 10ml..."
        />
        {errors.dosage && (
          <p className="text-sm text-red-600">{errors.dosage.message}</p>
        )}
      </div>

      {/* Frequency */}
      <div className="space-y-2">
        <Label htmlFor="frequency">Fréquence *</Label>
        <Input
          id="frequency"
          {...register('frequency', { required: 'La fréquence est requise' })}
          placeholder="Ex: 2 fois par jour, matin et soir..."
        />
        {errors.frequency && (
          <p className="text-sm text-red-600">{errors.frequency.message}</p>
        )}
      </div>

      {/* Duration */}
      <div className="space-y-2">
        <Label htmlFor="duration">Durée</Label>
        <Input
          id="duration"
          {...register('duration')}
          placeholder="Ex: 7 jours, 2 semaines..."
        />
      </div>

      {/* Start Date */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Date de début *</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !startDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {startDate ? format(startDate, "PPP", { locale: fr }) : "Sélectionner"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={startDate}
                onSelect={(date) => {
                  if (date) {
                    setStartDate(date);
                    setValue('startDate', date);
                  }
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* End Date */}
        <div className="space-y-2">
          <Label>Date de fin</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !endDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {endDate ? format(endDate, "PPP", { locale: fr }) : "Optionnel"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={endDate}
                onSelect={(date) => {
                  setEndDate(date);
                  setValue('endDate', date);
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Instructions */}
      <div className="space-y-2">
        <Label htmlFor="instructions">Instructions</Label>
        <Textarea
          id="instructions"
          {...register('instructions')}
          placeholder="Instructions particulières..."
          rows={3}
        />
      </div>

      {/* Actions */}
      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onSuccess}>
          Annuler
        </Button>
        <Button type="submit">
          Ajouter le Traitement
        </Button>
      </div>
    </div>
  );
};
