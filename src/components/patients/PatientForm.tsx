
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { usePatients } from '@/contexts/PatientContext';
import { PatientFormData } from '@/types/patient';
import { useToast } from '@/hooks/use-toast';

const patientSchema = z.object({
  firstName: z.string().min(1, 'Le prénom est requis'),
  lastName: z.string().min(1, 'Le nom est requis'),
  dateOfBirth: z.date({
    required_error: 'La date de naissance est requise',
  }),
  gender: z.enum(['male', 'female']),
  address: z.string().min(1, 'L\'adresse est requise'),
  phone: z.string().min(1, 'Le téléphone est requis'),
  email: z.string().email('Email invalide').optional().or(z.literal('')),
  emergencyContact: z.object({
    name: z.string().min(1, 'Le nom du contact d\'urgence est requis'),
    phone: z.string().min(1, 'Le téléphone du contact d\'urgence est requis'),
    relationship: z.string().min(1, 'La relation est requise'),
  }),
  medicalHistory: z.string().optional(),
  allergies: z.string().optional(),
  currentMedications: z.string().optional(),
  insuranceNumber: z.string().optional(),
});

interface PatientFormProps {
  onSuccess: () => void;
  initialData?: Partial<PatientFormData>;
  patientId?: string;
}

const relationshipOptions = [
  { value: 'spouse', label: 'Époux/Épouse' },
  { value: 'parent', label: 'Parent' },
  { value: 'child', label: 'Enfant' },
  { value: 'sibling', label: 'Frère/Sœur' },
  { value: 'friend', label: 'Ami(e)' },
  { value: 'colleague', label: 'Collègue' },
  { value: 'other', label: 'Autre' },
];

export const PatientForm: React.FC<PatientFormProps> = ({ 
  onSuccess, 
  initialData,
  patientId 
}) => {
  const { addPatient, updatePatient } = usePatients();
  const { toast } = useToast();
  
  const form = useForm<PatientFormData>({
    resolver: zodResolver(patientSchema),
    defaultValues: {
      firstName: initialData?.firstName || '',
      lastName: initialData?.lastName || '',
      dateOfBirth: initialData?.dateOfBirth,
      gender: initialData?.gender || 'male',
      address: initialData?.address || '',
      phone: initialData?.phone || '',
      email: initialData?.email || '',
      emergencyContact: {
        name: initialData?.emergencyContact?.name || '',
        phone: initialData?.emergencyContact?.phone || '',
        relationship: initialData?.emergencyContact?.relationship || '',
      },
      medicalHistory: initialData?.medicalHistory || '',
      allergies: initialData?.allergies || '',
      currentMedications: initialData?.currentMedications || '',
      insuranceNumber: initialData?.insuranceNumber || '',
    },
  });

  const onSubmit = (data: PatientFormData) => {
    try {
      if (patientId) {
        // Mode modification
        updatePatient(patientId, {
          firstName: data.firstName,
          lastName: data.lastName,
          dateOfBirth: data.dateOfBirth!,
          gender: data.gender,
          address: data.address,
          phone: data.phone,
          email: data.email || undefined,
          emergencyContact: data.emergencyContact,
          medicalHistory: data.medicalHistory,
          allergies: data.allergies,
          currentMedications: data.currentMedications,
          insuranceNumber: data.insuranceNumber || undefined,
        });
        
        toast({
          title: "Patient modifié",
          description: "Les informations du patient ont été mises à jour avec succès.",
        });
      } else {
        // Mode ajout
        addPatient({
          firstName: data.firstName,
          lastName: data.lastName,
          dateOfBirth: data.dateOfBirth!,
          gender: data.gender,
          address: data.address,
          phone: data.phone,
          email: data.email || undefined,
          emergencyContact: data.emergencyContact,
          medicalHistory: data.medicalHistory,
          allergies: data.allergies,
          currentMedications: data.currentMedications,
          insuranceNumber: data.insuranceNumber || undefined,
          medicalRecord: {
            allergies: data.allergies ? [data.allergies] : [],
            medicalHistory: data.medicalHistory ? [data.medicalHistory] : [],
            currentTreatments: [],
          },
          consultations: [],
        });
        
        toast({
          title: "Patient ajouté",
          description: "Le nouveau patient a été enregistré avec succès.",
        });
      }
      
      onSuccess();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'enregistrement.",
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      {/* Informations personnelles */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Informations personnelles</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="firstName">Prénom *</Label>
            <Input
              id="firstName"
              {...form.register('firstName')}
              className="mt-1"
            />
            {form.formState.errors.firstName && (
              <p className="text-sm text-red-600 mt-1">
                {form.formState.errors.firstName.message}
              </p>
            )}
          </div>
          
          <div>
            <Label htmlFor="lastName">Nom *</Label>
            <Input
              id="lastName"
              {...form.register('lastName')}
              className="mt-1"
            />
            {form.formState.errors.lastName && (
              <p className="text-sm text-red-600 mt-1">
                {form.formState.errors.lastName.message}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Date de naissance *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal mt-1",
                    !form.watch('dateOfBirth') && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {form.watch('dateOfBirth') ? (
                    format(form.watch('dateOfBirth')!, "PPP", { locale: fr })
                  ) : (
                    <span>Sélectionner une date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={form.watch('dateOfBirth')}
                  onSelect={(date) => form.setValue('dateOfBirth', date)}
                  disabled={(date) =>
                    date > new Date() || date < new Date("1900-01-01")
                  }
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
            {form.formState.errors.dateOfBirth && (
              <p className="text-sm text-red-600 mt-1">
                {form.formState.errors.dateOfBirth.message}
              </p>
            )}
          </div>

          <div>
            <Label>Sexe *</Label>
            <RadioGroup 
              value={form.watch('gender')} 
              onValueChange={(value) => form.setValue('gender', value as 'male' | 'female')}
              className="flex flex-row gap-6 mt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="male" id="male" />
                <Label htmlFor="male">Homme</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="female" id="female" />
                <Label htmlFor="female">Femme</Label>
              </div>
            </RadioGroup>
          </div>
        </div>

        <div>
          <Label htmlFor="address">Adresse *</Label>
          <Textarea
            id="address"
            {...form.register('address')}
            className="mt-1"
            rows={2}
          />
          {form.formState.errors.address && (
            <p className="text-sm text-red-600 mt-1">
              {form.formState.errors.address.message}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="phone">Téléphone *</Label>
            <Input
              id="phone"
              {...form.register('phone')}
              className="mt-1"
            />
            {form.formState.errors.phone && (
              <p className="text-sm text-red-600 mt-1">
                {form.formState.errors.phone.message}
              </p>
            )}
          </div>
          
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              {...form.register('email')}
              className="mt-1"
            />
            {form.formState.errors.email && (
              <p className="text-sm text-red-600 mt-1">
                {form.formState.errors.email.message}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Contact d'urgence */}
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

      {/* Historique médical */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Historique médical</h3>
        
        <div>
          <Label htmlFor="medicalHistory">Antécédents médicaux</Label>
          <Textarea
            id="medicalHistory"
            {...form.register('medicalHistory')}
            className="mt-1"
            rows={3}
            placeholder="Antécédents médicaux du patient..."
          />
        </div>

        <div>
          <Label htmlFor="allergies">Allergies</Label>
          <Textarea
            id="allergies"
            {...form.register('allergies')}
            className="mt-1"
            rows={2}
            placeholder="Allergies connues..."
          />
        </div>

        <div>
          <Label htmlFor="currentMedications">Médicaments actuels</Label>
          <Textarea
            id="currentMedications"
            {...form.register('currentMedications')}
            className="mt-1"
            rows={2}
            placeholder="Médicaments en cours..."
          />
        </div>
        
        <div>
          <Label htmlFor="insuranceNumber">Numéro d'assurance</Label>
          <Input
            id="insuranceNumber"
            {...form.register('insuranceNumber')}
            className="mt-1"
          />
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onSuccess}>
          Annuler
        </Button>
        <Button type="submit">
          {patientId ? 'Modifier' : 'Ajouter'} le patient
        </Button>
      </div>
    </form>
  );
};
