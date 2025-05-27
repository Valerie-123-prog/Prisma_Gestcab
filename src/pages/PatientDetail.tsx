
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Edit, Calendar, User, Phone, Mail, AlertTriangle } from 'lucide-react';
import { usePatients } from '@/contexts/PatientContext';
import { PatientForm } from '@/components/patients/PatientForm';
import { ConsultationForm } from '@/components/patients/ConsultationForm';
import { ConsultationList } from '@/components/patients/ConsultationList';
import { MedicalRecord } from '@/components/patients/MedicalRecord';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const PatientDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getPatient } = usePatients();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isConsultationDialogOpen, setIsConsultationDialogOpen] = useState(false);

  const patient = id ? getPatient(id) : undefined;

  if (!patient) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Patient introuvable</h2>
          <p className="text-gray-600 mb-4">Le patient demandé n'existe pas.</p>
          <Button onClick={() => navigate('/patients')}>
            Retour à la liste
          </Button>
        </div>
      </div>
    );
  }

  const age = new Date().getFullYear() - patient.dateOfBirth.getFullYear();
  const genderLabels = {
    male: 'Homme',
    female: 'Femme',
    other: 'Autre'
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* En-tête */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => navigate('/patients')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {patient.firstName} {patient.lastName}
              </h1>
              <p className="text-gray-600">{age} ans • {genderLabels[patient.gender]}</p>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Edit className="h-4 w-4 mr-2" />
                  Modifier
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Modifier le Patient</DialogTitle>
                </DialogHeader>
                <PatientForm
                  patientId={patient.id}
                  initialData={{
                    firstName: patient.firstName,
                    lastName: patient.lastName,
                    dateOfBirth: patient.dateOfBirth,
                    gender: patient.gender,
                    address: patient.address,
                    phone: patient.phone,
                    email: patient.email || '',
                    emergencyContactName: patient.emergencyContact.name,
                    emergencyContactPhone: patient.emergencyContact.phone,
                    emergencyContactRelationship: patient.emergencyContact.relationship,
                    insuranceNumber: patient.insuranceNumber || '',
                  }}
                  onSuccess={() => setIsEditDialogOpen(false)}
                />
              </DialogContent>
            </Dialog>
            
            <Dialog open={isConsultationDialogOpen} onOpenChange={setIsConsultationDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Calendar className="h-4 w-4 mr-2" />
                  Nouvelle Consultation
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle>Nouvelle Consultation</DialogTitle>
                </DialogHeader>
                <ConsultationForm
                  patientId={patient.id}
                  onSuccess={() => setIsConsultationDialogOpen(false)}
                />
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Informations rapides */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <User className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">Date de naissance</p>
                  <p className="font-semibold">
                    {format(patient.dateOfBirth, 'dd MMMM yyyy', { locale: fr })}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <Phone className="h-8 w-8 text-green-600" />
                <div>
                  <p className="text-sm text-gray-600">Téléphone</p>
                  <p className="font-semibold">{patient.phone}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <Calendar className="h-8 w-8 text-purple-600" />
                <div>
                  <p className="text-sm text-gray-600">Consultations</p>
                  <p className="font-semibold">{patient.consultations.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Onglets */}
        <Tabs defaultValue="info" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="info">Informations</TabsTrigger>
            <TabsTrigger value="medical">Dossier Médical</TabsTrigger>
            <TabsTrigger value="consultations">Consultations</TabsTrigger>
          </TabsList>

          <TabsContent value="info" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Informations Personnelles</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Nom complet</p>
                    <p className="font-medium">{patient.firstName} {patient.lastName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Adresse</p>
                    <p className="font-medium">{patient.address}</p>
                  </div>
                  {patient.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <span>{patient.email}</span>
                    </div>
                  )}
                  {patient.insuranceNumber && (
                    <div>
                      <p className="text-sm text-gray-600">Numéro d'assurance</p>
                      <p className="font-medium">{patient.insuranceNumber}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Contact d'Urgence</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Nom</p>
                    <p className="font-medium">{patient.emergencyContact.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Téléphone</p>
                    <p className="font-medium">{patient.emergencyContact.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Relation</p>
                    <p className="font-medium">{patient.emergencyContact.relationship}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="medical">
            <MedicalRecord patient={patient} />
          </TabsContent>

          <TabsContent value="consultations">
            <ConsultationList patient={patient} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default PatientDetail;
