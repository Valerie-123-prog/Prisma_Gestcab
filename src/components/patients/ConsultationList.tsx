
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, User } from 'lucide-react';
import { Patient } from '@/types/patient';
import { formatDateFr, formatTimeFr } from '@/lib/dateUtils';

interface ConsultationListProps {
  patient: Patient;
}

export const ConsultationList: React.FC<ConsultationListProps> = ({ patient }) => {
  const sortedConsultations = [...(patient.consultations || [])].sort((a, b) => 
    b.date.getTime() - a.date.getTime()
  );

  if (sortedConsultations.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Aucune consultation
            </h3>
            <p className="text-gray-500">
              Les consultations apparaîtront ici une fois ajoutées.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {sortedConsultations.map((consultation) => (
        <Card key={consultation.id}>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-lg">
                  {formatDateFr(consultation.date, 'dd MMMM yyyy')}
                </CardTitle>
                <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                  <User className="h-4 w-4" />
                  <span>Dr. {consultation.doctorName}</span>
                </div>
              </div>
              <Badge variant="outline">
                {formatTimeFr(consultation.date)}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Diagnostic</h4>
              <p className="text-gray-700">{consultation.diagnosis}</p>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Prescription</h4>
              <p className="text-gray-700">{consultation.prescription}</p>
            </div>
            
            {consultation.notes && (
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Notes</h4>
                <p className="text-gray-700">{consultation.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
