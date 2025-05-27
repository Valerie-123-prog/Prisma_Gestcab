import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { usePatients } from '@/contexts/PatientContext';
import { toast } from '@/hooks/use-toast';

const treatmentSchema = z.object({
  medication: z.string().min(1, 'Le médicament est requis'),
  dosage: z.string().min(1, 'La posologie est requise'),
  frequency: z.string().min(1, 'La fréquence est requise'),
  startDate: z.date({
    required_error: 'La date de début est requise',
  }),
  endDate: z.date().optional(),
  notes: z.string().optional(),
});

type TreatmentFormData = z.infer<typeof treatmentSchema>;

interface TreatmentFormProps {
  patientId: string;
  onSuccess?: () => void;
}

export const TreatmentForm: React.FC<TreatmentFormProps> = ({ patientId, onSuccess }) => {
  const { addTreatment } = usePatients();

  const form = useForm<TreatmentFormData>({
    resolver: zodResolver(treatmentSchema),
    defaultValues: {
      medication: '',
      dosage: '',
      frequency: '',
      startDate: new Date(),
      notes: '',
    },
  });

  const onSubmit = (data: TreatmentFormData) => {
    // Tous les champs requis sont maintenant garantis par le schéma
    addTreatment(patientId, {
      medication: data.medication,
      dosage: data.dosage,
      frequency: data.frequency,
      startDate: data.startDate,
      endDate: data.endDate,
      notes: data.notes || '',
    });

    toast({
      title: 'Traitement ajouté',
      description: 'Le traitement a été enregistré avec succès',
    });

    form.reset();
    onSuccess?.();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <Label htmlFor="medication">Médicament</Label>
          <Input
            id="medication"
            {...form.register('medication')}
            className="mt-1"
          />
          {form.formState.errors.medication && (
            <p className="text-sm text-red-600 mt-1">
              {form.formState.errors.medication.message}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="dosage">Dosage</Label>
            <Input
              id="dosage"
              {...form.register('dosage')}
              placeholder="Ex: 500mg"
              className="mt-1"
            />
            {form.formState.errors.dosage && (
              <p className="text-sm text-red-600 mt-1">
                {form.formState.errors.dosage.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="frequency">Fréquence</Label>
            <Input
              id="frequency"
              {...form.register('frequency')}
              placeholder="Ex: 2 fois par jour"
              className="mt-1"
            />
            {form.formState.errors.frequency && (
              <p className="text-sm text-red-600 mt-1">
                {form.formState.errors.frequency.message}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Date de début</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal mt-1",
                    !form.watch('startDate') && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {form.watch('startDate') ? (
                    format(form.watch('startDate'), "PPP", { locale: fr })
                  ) : (
                    <span>Sélectionner une date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={form.watch('startDate')}
                  onSelect={(date) => form.setValue('startDate', date || new Date())}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
            {form.formState.errors.startDate && (
              <p className="text-sm text-red-600 mt-1">
                {form.formState.errors.startDate.message}
              </p>
            )}
          </div>

          <div>
            <Label>Date de fin (optionnel)</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal mt-1",
                    !form.watch('endDate') && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {form.watch('endDate') ? (
                    format(form.watch('endDate'), "PPP", { locale: fr })
                  ) : (
                    <span>Traitement en cours</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={form.watch('endDate')}
                  onSelect={(date) => form.setValue('endDate', date)}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div>
          <Label htmlFor="notes">Notes (optionnel)</Label>
          <Textarea
            id="notes"
            {...form.register('notes')}
            className="mt-1"
            rows={3}
          />
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="outline" onClick={onSuccess}>
            Annuler
          </Button>
          <Button type="submit">
            Ajouter le traitement
          </Button>
        </div>
      </form>
    </Form>
  );
};
