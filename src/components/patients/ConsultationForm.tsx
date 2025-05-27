
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
import { Consultation } from '@/types/patient';
import { usePatients } from '@/contexts/PatientContext';
import { useToast } from '@/hooks/use-toast';

interface ConsultationFormProps {
  patientId: string;
  onSuccess: () => void;
}

export const ConsultationForm: React.FC<ConsultationFormProps> = ({ patientId, onSuccess }) => {
  const { addConsultation } = usePatients();
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = React.useState<Date>(new Date());

  const { register, handleSubmit, formState: { errors }, setValue } = useForm<Omit<Consultation, 'id'>>({
    defaultValues: {
      date: new Date(),
      reason: '',
      symptoms: '',
      diagnosis: '',
      prescription: '',
      notes: ''
    }
  });

  const onSubmit = (data: Omit<Consultation, 'id'>) => {
    const consultationData = {
      ...data,
      date: selectedDate
    };

    addConsultation(patientId, consultationData);
    
    toast({
      title: "Succès",
      description: "Consultation ajoutée avec succès",
    });

    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Date */}
      <div className="space-y-2">
        <Label>Date de consultation *</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !selectedDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {selectedDate ? format(selectedDate, "PPP", { locale: fr }) : "Sélectionner une date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => {
                if (date) {
                  setSelectedDate(date);
                  setValue('date', date);
                }
              }}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* Reason */}
      <div className="space-y-2">
        <Label htmlFor="reason">Motif de consultation *</Label>
        <Input
          id="reason"
          {...register('reason', { required: 'Le motif est requis' })}
          placeholder="Ex: Consultation de contrôle, douleur..."
        />
        {errors.reason && (
          <p className="text-sm text-red-600">{errors.reason.message}</p>
        )}
      </div>

      {/* Symptoms */}
      <div className="space-y-2">
        <Label htmlFor="symptoms">Symptômes observés</Label>
        <Textarea
          id="symptoms"
          {...register('symptoms')}
          placeholder="Décrire les symptômes observés..."
          rows={3}
        />
      </div>

      {/* Diagnosis */}
      <div className="space-y-2">
        <Label htmlFor="diagnosis">Diagnostic *</Label>
        <Textarea
          id="diagnosis"
          {...register('diagnosis', { required: 'Le diagnostic est requis' })}
          placeholder="Diagnostic posé..."
          rows={3}
        />
        {errors.diagnosis && (
          <p className="text-sm text-red-600">{errors.diagnosis.message}</p>
        )}
      </div>

      {/* Prescription */}
      <div className="space-y-2">
        <Label htmlFor="prescription">Prescription</Label>
        <Textarea
          id="prescription"
          {...register('prescription')}
          placeholder="Médicaments prescrits, posologie..."
          rows={4}
        />
      </div>

      {/* Notes */}
      <div className="space-y-2">
        <Label htmlFor="notes">Notes additionnelles</Label>
        <Textarea
          id="notes"
          {...register('notes')}
          placeholder="Notes complémentaires..."
          rows={3}
        />
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
