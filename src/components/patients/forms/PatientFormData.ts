
import { z } from 'zod';

export const patientSchema = z.object({
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

export const relationshipOptions = [
  { value: 'spouse', label: 'Époux/Épouse' },
  { value: 'parent', label: 'Parent' },
  { value: 'child', label: 'Enfant' },
  { value: 'sibling', label: 'Frère/Sœur' },
  { value: 'friend', label: 'Ami(e)' },
  { value: 'colleague', label: 'Collègue' },
  { value: 'other', label: 'Autre' },
];
