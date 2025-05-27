
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Calendar, Users, Receipt, TrendingUp, Activity } from 'lucide-react';
import { usePatients } from '@/contexts/PatientContext';
import { useAppointments } from '@/contexts/AppointmentContext';
import { useBilling } from '@/contexts/BillingContext';
import { startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';
import { fr } from 'date-fns/locale';

type Period = 'today' | 'week' | 'month';

export const ActivityReports: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<Period>('today');
  const { patients } = usePatients();
  const { appointments } = useAppointments();
  const { invoices } = useBilling();

  const getPeriodRange = (period: Period) => {
    const now = new Date();
    switch (period) {
      case 'today':
        return { start: startOfDay(now), end: endOfDay(now) };
      case 'week':
        return { start: startOfWeek(now, { locale: fr }), end: endOfWeek(now, { locale: fr }) };
      case 'month':
        return { start: startOfMonth(now), end: endOfMonth(now) };
    }
  };

  const { start, end } = getPeriodRange(selectedPeriod);

  // Filter data by period
  const filteredAppointments = appointments.filter(apt => 
    isWithinInterval(apt.date, { start, end })
  );

  const filteredInvoices = invoices.filter(inv => 
    isWithinInterval(inv.date, { start, end })
  );

  const newPatients = patients.filter(patient => 
    isWithinInterval(patient.createdAt, { start, end })
  );

  const totalConsultations = patients.reduce((total, patient) => 
    total + patient.consultations.filter(consult => 
      isWithinInterval(consult.date, { start, end })
    ).length, 0
  );

  const totalRevenue = filteredInvoices.reduce((sum, inv) => sum + inv.total, 0);
  const paidRevenue = filteredInvoices.filter(inv => inv.status === 'paid').reduce((sum, inv) => sum + inv.total, 0);
  const unpaidAmount = filteredInvoices.filter(inv => inv.status === 'unpaid').reduce((sum, inv) => sum + inv.total, 0);

  const recurringPatients = patients.filter(patient => 
    patient.consultations.length > 1 && 
    patient.consultations.some(consult => isWithinInterval(consult.date, { start, end }))
  ).length;

  const getPeriodLabel = (period: Period) => {
    switch (period) {
      case 'today': return 'Aujourd\'hui';
      case 'week': return 'Cette semaine';
      case 'month': return 'Ce mois';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Rapports d'activité</h2>
        <Select value={selectedPeriod} onValueChange={(value: Period) => setSelectedPeriod(value)}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="today">Aujourd'hui</SelectItem>
            <SelectItem value="week">Cette semaine</SelectItem>
            <SelectItem value="month">Ce mois</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              Rendez-vous
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {filteredAppointments.length}
            </div>
            <p className="text-xs text-gray-500">{getPeriodLabel(selectedPeriod)}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
              <Activity className="h-4 w-4 mr-2" />
              Consultations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {totalConsultations}
            </div>
            <p className="text-xs text-gray-500">{getPeriodLabel(selectedPeriod)}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
              <Users className="h-4 w-4 mr-2" />
              Nouveaux patients
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {newPatients.length}
            </div>
            <p className="text-xs text-gray-500">{getPeriodLabel(selectedPeriod)}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
              <Receipt className="h-4 w-4 mr-2" />
              Chiffre d'affaires
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {totalRevenue.toLocaleString()} FCFA
            </div>
            <p className="text-xs text-gray-500">{getPeriodLabel(selectedPeriod)}</p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Patient Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Statistiques Patients</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span>Patients récurrents</span>
              <span className="font-semibold">{recurringPatients}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Nouveaux patients</span>
              <span className="font-semibold">{newPatients.length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Total consultations</span>
              <span className="font-semibold">{totalConsultations}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Moyenne consultations/jour</span>
              <span className="font-semibold">
                {selectedPeriod === 'today' ? totalConsultations : 
                 selectedPeriod === 'week' ? (totalConsultations / 7).toFixed(1) :
                 (totalConsultations / 30).toFixed(1)}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Financial Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Analyse Financière</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span>Revenus totaux</span>
              <span className="font-semibold text-green-600">
                {totalRevenue.toLocaleString()} FCFA
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span>Revenus encaissés</span>
              <span className="font-semibold text-green-600">
                {paidRevenue.toLocaleString()} FCFA
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span>Impayés</span>
              <span className="font-semibold text-red-600">
                {unpaidAmount.toLocaleString()} FCFA
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span>Taux de recouvrement</span>
              <span className="font-semibold">
                {totalRevenue > 0 ? ((paidRevenue / totalRevenue) * 100).toFixed(1) : 0}%
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Activité récente</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredAppointments.slice(0, 5).map((appointment) => {
              const patient = patients.find(p => p.id === appointment.patientId);
              return (
                <div key={appointment.id} className="flex justify-between items-center py-2 border-b">
                  <div>
                    <div className="font-medium">
                      RDV {appointment.type} - {patient?.firstName} {patient?.lastName}
                    </div>
                    <div className="text-sm text-gray-500">
                      {appointment.date.toLocaleDateString()} à {appointment.date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                  <div className="text-sm font-medium">
                    {appointment.status === 'confirmed' ? '✅' : 
                     appointment.status === 'cancelled' ? '❌' : '⏳'}
                  </div>
                </div>
              );
            })}
            
            {filteredAppointments.length === 0 && (
              <div className="text-center py-4 text-gray-500">
                Aucune activité pour {getPeriodLabel(selectedPeriod).toLowerCase()}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
