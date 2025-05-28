
import React, { useState } from 'react';
import { Plus, Settings, Users, Calendar as CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AppointmentForm } from '@/components/appointments/AppointmentForm';
import { CalendarView } from '@/components/appointments/CalendarView';
import { formatDateFr } from '@/lib/dateUtils';
import { useAppointments } from '@/contexts/AppointmentContext';
import { Appointment } from '@/types/appointment';

const Appointments = () => {
  const { appointments, waitingList } = useAppointments();
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const todayAppointments = appointments.filter(apt => {
    const today = new Date();
    const aptDate = new Date(apt.date);
    return aptDate.toDateString() === today.toDateString() && apt.status === 'scheduled';
  });

  const upcomingAppointments = appointments.filter(apt => {
    const today = new Date();
    const aptDate = new Date(apt.date);
    return aptDate > today && apt.status === 'scheduled';
  });

  const handleAppointmentClick = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
  };

  const handleTimeSlotClick = (date: Date, time: string) => {
    setIsFormOpen(true);
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Rendez-vous</h1>
          <p className="text-muted-foreground">
            Gérez vos rendez-vous et consultations
          </p>
        </div>
        
        <div className="flex gap-2">
          <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Nouveau RDV
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Nouveau rendez-vous</DialogTitle>
              </DialogHeader>
              <AppointmentForm onSuccess={() => setIsFormOpen(false)} />
            </DialogContent>
          </Dialog>
          
          <Button variant="outline">
            <Settings className="w-4 h-4 mr-2" />
            Paramètres
          </Button>
        </div>
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aujourd'hui</CardTitle>
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayAppointments.length}</div>
            <p className="text-xs text-muted-foreground">
              rendez-vous programmés
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">À venir</CardTitle>
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{upcomingAppointments.length}</div>
            <p className="text-xs text-muted-foreground">
              rendez-vous futurs
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Liste d'attente</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{waitingList.length}</div>
            <p className="text-xs text-muted-foreground">
              patients en attente
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Contenu principal avec onglets */}
      <Tabs defaultValue="calendar" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="calendar">Calendrier</TabsTrigger>
          <TabsTrigger value="today">Aujourd'hui</TabsTrigger>
          <TabsTrigger value="waiting">Liste d'attente</TabsTrigger>
        </TabsList>
        
        <TabsContent value="calendar" className="space-y-4">
          <Card>
            <CardContent className="p-6">
              <CalendarView
                onAppointmentClick={handleAppointmentClick}
                onTimeSlotClick={handleTimeSlotClick}
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="today" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Rendez-vous d'aujourd'hui</CardTitle>
              <CardDescription>
                {todayAppointments.length} rendez-vous programmés
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {todayAppointments.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  Aucun rendez-vous aujourd'hui
                </p>
              ) : (
                todayAppointments.map(appointment => (
                  <Card key={appointment.id} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: appointment.consultationType.color }}
                          />
                          <div>
                            <div className="font-medium">{appointment.patientName}</div>
                            <div className="text-sm text-muted-foreground">
                              {appointment.consultationType.name}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">
                            {appointment.startTime} - {appointment.endTime}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {appointment.consultationType.duration} min
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="waiting" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Liste d'attente</CardTitle>
              <CardDescription>
                Patients en attente d'un créneau
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {waitingList.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  Aucun patient en liste d'attente
                </p>
              ) : (
                waitingList.map(entry => (
                  <Card key={entry.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">{entry.patientName}</div>
                          <div className="text-sm text-muted-foreground">
                            {entry.consultationType.name}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {entry.phoneNumber}
                          </div>
                        </div>
                        <Button size="sm">
                          Programmer
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Appointments;
