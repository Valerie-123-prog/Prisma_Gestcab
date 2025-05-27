
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User, Calendar, Phone } from 'lucide-react';
import { Patient } from '@/types/patient';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface PatientCardProps {
  patient: Patient;
  onClick: () => void;
}

export const PatientCard: React.FC<PatientCardProps> = ({ patient, onClick }) => {
  const age = new Date().getFullYear() - patient.dateOfBirth.getFullYear();
  const lastConsultation = patient.consultations.length > 0 
    ? patient.consultations.sort((a, b) => b.date.getTime() - a.date.getTime())[0]
    : null;

  const genderLabels = {
    male: 'Homme',
    female: 'Femme',
    other: 'Autre'
  };

  return (
    <Card 
      className="cursor-pointer hover:shadow-lg transition-shadow duration-200 hover:border-blue-300"
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            {patient.photo ? (
              <img 
                src={patient.photo} 
                alt={`${patient.firstName} ${patient.lastName}`}
                className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                <User className="h-6 w-6 text-blue-600" />
              </div>
            )}
            
            <div>
              <h3 className="font-semibold text-lg text-gray-900">
                {patient.firstName} {patient.lastName}
              </h3>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span>{age} ans</span>
                <span>•</span>
                <span>{genderLabels[patient.gender]}</span>
              </div>
            </div>
          </div>
          
          <Badge variant="outline" className="text-xs">
            {patient.consultations.length} consultation{patient.consultations.length !== 1 ? 's' : ''}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Phone className="h-4 w-4" />
          <span>{patient.phone}</span>
        </div>
        
        {lastConsultation && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="h-4 w-4" />
            <span>
              Dernière consultation: {format(lastConsultation.date, 'dd MMM yyyy', { locale: fr })}
            </span>
          </div>
        )}
        
        {patient.medicalRecord.allergies.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {patient.medicalRecord.allergies.slice(0, 2).map((allergy, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {allergy}
              </Badge>
            ))}
            {patient.medicalRecord.allergies.length > 2 && (
              <Badge variant="secondary" className="text-xs">
                +{patient.medicalRecord.allergies.length - 2}
              </Badge>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
