
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Search, User, UserPlus } from 'lucide-react';
import { usePatients } from '@/contexts/PatientContext';
import { PatientForm } from '@/components/patients/PatientForm';
import { PatientCard } from '@/components/patients/PatientCard';
import { AdvancedFilters, FilterOptions } from '@/components/common/AdvancedFilters';
import { ExportData } from '@/components/common/ExportData';
import { useNavigate } from 'react-router-dom';
import { isWithinInterval } from 'date-fns';

const Patients = () => {
  const { patients, searchPatients } = usePatients();
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FilterOptions>({});
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const navigate = useNavigate();

  const handlePatientClick = (patientId: string) => {
    navigate(`/patients/${patientId}`);
  };

  // Apply search and filters
  let filteredPatients = searchPatients(searchQuery);

  // Apply date filters
  if (filters.dateFrom || filters.dateTo) {
    filteredPatients = filteredPatients.filter(patient => {
      if (filters.dateFrom && patient.createdAt < filters.dateFrom) return false;
      if (filters.dateTo && patient.createdAt > filters.dateTo) return false;
      return true;
    });
  }

  const filterTypes = [
    { value: 'new', label: 'Nouveaux patients' },
    { value: 'recurring', label: 'Patients récurrents' }
  ];

  const statusOptions = [
    { value: 'active', label: 'Actif' },
    { value: 'inactive', label: 'Inactif' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* En-tête */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-2">
            <User className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Gestion des Patients</h1>
          </div>
          
          <div className="flex gap-2">
            <ExportData data={filteredPatients} filename="patients" type="patients" />
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <UserPlus className="h-4 w-4" />
                  Nouveau Patient
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Ajouter un Nouveau Patient</DialogTitle>
                </DialogHeader>
                <PatientForm onSuccess={() => setIsAddDialogOpen(false)} />
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Barre de recherche et filtres */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Rechercher par nom, téléphone ou email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <AdvancedFilters
                onFiltersChange={setFilters}
                filterTypes={filterTypes}
                statusOptions={statusOptions}
              />
            </div>
          </CardContent>
        </Card>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Patients</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{patients.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Patients Trouvés</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{filteredPatients.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Consultations Récentes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                {patients.reduce((total, patient) => total + patient.consultations.length, 0)}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Liste des patients */}
        <div className="space-y-4">
          {filteredPatients.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {searchQuery ? 'Aucun patient trouvé' : 'Aucun patient enregistré'}
                  </h3>
                  <p className="text-gray-500">
                    {searchQuery 
                      ? 'Essayez de modifier votre recherche' 
                      : 'Commencez par ajouter votre premier patient'
                    }
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredPatients.map((patient) => (
                <PatientCard
                  key={patient.id}
                  patient={patient}
                  onClick={() => handlePatientClick(patient.id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Patients;
