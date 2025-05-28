
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { PatientFormData } from '@/types/patient';

interface PersonalInfoSectionProps {
  form: UseFormReturn<PatientFormData>;
}

export const PersonalInfoSection: React.FC<PersonalInfoSectionProps> = ({ form }) => {
  return (
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
  );
};
