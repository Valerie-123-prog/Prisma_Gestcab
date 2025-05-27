
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertTriangle, Plus, Pill, History, X } from 'lucide-react';
import { Patient } from '@/types/patient';
import { usePatients } from '@/contexts/PatientContext';
import { TreatmentForm } from './TreatmentForm';

interface MedicalRecordProps {
  patient: Patient;
}

export const MedicalRecord: React.FC<MedicalRecordProps> = ({ patient }) => {
  const { updatePatient } = usePatients();
  const [newAllergy, setNewAllergy] = useState('');
  const [newHistory, setNewHistory] = useState('');
  const [isTreatmentDialogOpen, setIsTreatmentDialogOpen] = useState(false);

  const addAllergy = () => {
    if (newAllergy.trim()) {
      const updatedAllergies = [...patient.medicalRecord.allergies, newAllergy.trim()];
      updatePatient(patient.id, {
        medicalRecord: {
          ...patient.medicalRecord,
          allergies: updatedAllergies,
        }
      });
      setNewAllergy('');
    }
  };

  const removeAllergy = (index: number) => {
    const updatedAllergies = patient.medicalRecord.allergies.filter((_, i) => i !== index);
    updatePatient(patient.id, {
      medicalRecord: {
        ...patient.medicalRecord,
        allergies: updatedAllergies,
      }
    });
  };

  const addHistory = () => {
    if (newHistory.trim()) {
      const updatedHistory = [...patient.medicalRecord.medicalHistory, newHistory.trim()];
      updatePatient(patient.id, {
        medicalRecord: {
          ...patient.medicalRecord,
          medicalHistory: updatedHistory,
        }
      });
      setNewHistory('');
    }
  };

  const removeHistory = (index: number) => {
    const updatedHistory = patient.medicalRecord.medicalHistory.filter((_, i) => i !== index);
    updatePatient(patient.id, {
      medicalRecord: {
        ...patient.medicalRecord,
        medicalHistory: updatedHistory,
      }
    });
  };

  const activeTreatments = patient.medicalRecord.currentTreatments.filter(
    treatment => !treatment.endDate || treatment.endDate > new Date()
  );

  return (
    <div className="space-y-6">
      {/* Allergies */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <CardTitle>Allergies</CardTitle>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {patient.medicalRecord.allergies.map((allergy, index) => (
              <Badge key={index} variant="destructive" className="flex items-center gap-1">
                {allergy}
                <button
                  onClick={() => removeAllergy(index)}
                  className="ml-1 hover:bg-red-700 rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
            {patient.medicalRecord.allergies.length === 0 && (
              <p className="text-gray-500">Aucune allergie connue</p>
            )}
          </div>
          
          <div className="flex gap-2">
            <Input
              placeholder="Ajouter une allergie..."
              value={newAllergy}
              onChange={(e) => setNewAllergy(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addAllergy()}
            />
            <Button onClick={addAllergy} disabled={!newAllergy.trim()}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Antécédents médicaux */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <History className="h-5 w-5 text-blue-600" />
            <CardTitle>Antécédents Médicaux</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            {patient.medicalRecord.medicalHistory.map((history, index) => (
              <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                <span>{history}</span>
                <button
                  onClick={() => removeHistory(index)}
                  className="text-red-600 hover:text-red-800"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
            {patient.medicalRecord.medicalHistory.length === 0 && (
              <p className="text-gray-500">Aucun antécédent médical enregistré</p>
            )}
          </div>
          
          <div className="flex gap-2">
            <Input
              placeholder="Ajouter un antécédent médical..."
              value={newHistory}
              onChange={(e) => setNewHistory(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addHistory()}
            />
            <Button onClick={addHistory} disabled={!newHistory.trim()}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Traitements en cours */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Pill className="h-5 w-5 text-green-600" />
              <CardTitle>Traitements en Cours</CardTitle>
            </div>
            
            <Dialog open={isTreatmentDialogOpen} onOpenChange={setIsTreatmentDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Ajouter un Traitement</DialogTitle>
                </DialogHeader>
                <TreatmentForm
                  patientId={patient.id}
                  onSuccess={() => setIsTreatmentDialogOpen(false)}
                />
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {activeTreatments.length === 0 ? (
            <p className="text-gray-500">Aucun traitement en cours</p>
          ) : (
            <div className="space-y-4">
              {activeTreatments.map((treatment) => (
                <div key={treatment.id} className="border rounded-lg p-4 space-y-2">
                  <div className="flex items-start justify-between">
                    <h4 className="font-semibold text-lg">{treatment.medication}</h4>
                    <Badge variant="outline">En cours</Badge>
                  </div>
                  <p className="text-gray-600">
                    <strong>Dosage:</strong> {treatment.dosage}
                  </p>
                  <p className="text-gray-600">
                    <strong>Fréquence:</strong> {treatment.frequency}
                  </p>
                  {treatment.notes && (
                    <p className="text-gray-600">
                      <strong>Notes:</strong> {treatment.notes}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
