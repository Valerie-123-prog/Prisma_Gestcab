
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { CalendarIcon, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { useAppointments } from '@/contexts/AppointmentContext';
import { usePatients } from '@/contexts/PatientContext';
import { toast } from '@/hooks/use-toast';

const appointmentSchema = z.object({
  patientId: z.string().min(1, 'Veuillez sélectionner un patient'),
  date: z.date({
    required_error: 'La date est requise',
  }),
  startTime: z.string().min(1, 'Veuillez sélectionner un horaire'),
  consultationTypeId: z.string().min(1, 'Veuillez sélectionner un type de consultation'),
  notes: z.string().optional(),
});

type AppointmentFormData = z.infer<typeof appointmentSchema>;

interface AppointmentFormProps {
  onSuccess?: () => void;
  selectedPatientId?: string;
}

export const AppointmentForm: React.FC<AppointmentFormProps> = ({ onSuccess, selectedPatientId }) => {
  const { addAppointment, consultationTypes, getAvailableSlots } = useAppointments();
  const { patients } = usePatients();
  const [availableSlots, setAvailableSlots] = useState<any[]>([]);

  const form = useForm<AppointmentFormData>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      patientId: selectedPatientId || '',
      notes: '',
    },
  });

  const selectedDate = form.watch('date');
  const selectedConsultationTypeId = form.watch('consultationTypeId');

  React.useEffect(() => {
    if (selectedDate && selectedConsultationTypeId) {
      const consultationType = consultationTypes.find(ct => ct.id === selectedConsultationTypeId);
      if (consultationType) {
        const slots = getAvailableSlots(selectedDate, consultationType);
        setAvailableSlots(slots);
      }
    }
  }, [selectedDate, selectedConsultationTypeId, consultationTypes, getAvailableSlots]);

  const onSubmit = (data: AppointmentFormData) => {
    const patient = patients.find(p => p.id === data.patientId);
    const consultationType = consultationTypes.find(ct => ct.id === data.consultationTypeId);
    
    if (!patient || !consultationType) {
      toast({
        title: 'Erreur',
        description: 'Patient ou type de consultation introuvable',
        variant: 'destructive',
      });
      return;
    }

    const selectedSlot = availableSlots.find(slot => slot.start === data.startTime);
    if (!selectedSlot?.available) {
      toast({
        title: 'Erreur',
        description: 'Ce créneau n\'est plus disponible',
        variant: 'destructive',
      });
      return;
    }

    addAppointment({
      patientId: data.patientId,
      patientName: `${patient.firstName} ${patient.lastName}`,
      date: data.date,
      startTime: data.startTime,
      endTime: selectedSlot.end,
      consultationType,
      status: 'scheduled',
      notes: data.notes,
    });

    toast({
      title: 'Rendez-vous créé',
      description: `Le rendez-vous a été programmé pour le ${format(data.date, 'dd/MM/yyyy', { locale: fr })} à ${data.startTime}`,
    });

    form.reset();
    onSuccess?.();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="patientId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Patient</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un patient" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {patients.map((patient) => (
                    <SelectItem key={patient.id} value={patient.id}>
                      {patient.firstName} {patient.lastName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="consultationTypeId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type de consultation</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {consultationTypes.map((type) => (
                    <SelectItem key={type.id} value={type.id}>
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: type.color }}
                        />
                        {type.name} ({type.duration} min)
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "dd/MM/yyyy", { locale: fr })
                      ) : (
                        <span>Sélectionner une date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) => date < new Date()}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        {availableSlots.length > 0 && (
          <FormField
            control={form.control}
            name="startTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Horaire</FormLabel>
                <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto">
                  {availableSlots.map((slot) => (
                    <Button
                      key={slot.start}
                      type="button"
                      variant={field.value === slot.start ? "default" : "outline"}
                      disabled={!slot.available}
                      className="h-12 text-sm"
                      onClick={() => field.onChange(slot.start)}
                    >
                      <Clock className="w-4 h-4 mr-1" />
                      {slot.start}
                    </Button>
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes (optionnel)</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Notes sur le rendez-vous..."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">
          Créer le rendez-vous
        </Button>
      </form>
    </Form>
  );
};
