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

const consultationSchema = z.object({
  date: z.date({
    required_error: 'La date est requise',
  }),
  diagnosis: z.string().min(1, 'Le diagnostic est requis'),
  prescription: z.string().min(1, 'La prescription est requise'),
  notes: z.string().optional(),
  doctorName: z.string().min(1, 'Le nom du médecin est requis'),
});

type ConsultationFormData = z.infer<typeof consultationSchema>;

interface ConsultationFormProps {
  patientId: string;
  onSuccess?: () => void;
}

export const ConsultationForm: React.FC<ConsultationFormProps> = ({ patientId, onSuccess }) => {
  const { addConsultation } = usePatients();

  const form = useForm<ConsultationFormData>({
    resolver: zodResolver(consultationSchema),
    defaultValues: {
      date: new Date(),
      diagnosis: '',
      prescription: '',
      notes: '',
      doctorName: '',
    },
  });

  const onSubmit = (data: ConsultationFormData) => {
    // Tous les champs requis sont maintenant garantis par le schéma
    addConsultation(patientId, {
      date: data.date,
      diagnosis: data.diagnosis,
      prescription: data.prescription,
      notes: data.notes || '',
      doctorName: data.doctorName,
    });

    toast({
      title: 'Consultation ajoutée',
      description: 'La consultation a été enregistrée avec succès',
    });

    form.reset();
    onSuccess?.();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <Label>Date de consultation</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal mt-1",
                  !form.watch('date') && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {form.watch('date') ? (
                  format(form.watch('date'), "PPP", { locale: fr })
                ) : (
                  <span>Sélectionner une date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={form.watch('date')}
                onSelect={(date) => form.setValue('date', date || new Date())}
                initialFocus
                className="p-3 pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
          {form.formState.errors.date && (
            <p className="text-sm text-red-600 mt-1">
              {form.formState.errors.date.message}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="doctorName">Nom du médecin</Label>
          <Input
            id="doctorName"
            {...form.register('doctorName')}
            className="mt-1"
          />
          {form.formState.errors.doctorName && (
            <p className="text-sm text-red-600 mt-1">
              {form.formState.errors.doctorName.message}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="diagnosis">Diagnostic</Label>
          <Textarea
            id="diagnosis"
            {...form.register('diagnosis')}
            className="mt-1"
            rows={3}
          />
          {form.formState.errors.diagnosis && (
            <p className="text-sm text-red-600 mt-1">
              {form.formState.errors.diagnosis.message}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="prescription">Prescription</Label>
          <Textarea
            id="prescription"
            {...form.register('prescription')}
            className="mt-1"
            rows={3}
          />
          {form.formState.errors.prescription && (
            <p className="text-sm text-red-600 mt-1">
              {form.formState.errors.prescription.message}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="notes">Notes (optionnel)</Label>
          <Textarea
            id="notes"
            {...form.register('notes')}
            className="mt-1"
            rows={2}
          />
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="outline" onClick={onSuccess}>
            Annuler
          </Button>
          <Button type="submit">
            Ajouter la consultation
          </Button>
        </div>
      </form>
    </Form>
  );
};
