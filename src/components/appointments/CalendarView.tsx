
import React, { useState } from 'react';
import { format, startOfWeek, addDays, isSameDay, addWeeks, subWeeks, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
import { fr } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAppointments } from '@/contexts/AppointmentContext';
import { Appointment } from '@/types/appointment';

type ViewType = 'day' | 'week' | 'month';

interface CalendarViewProps {
  onAppointmentClick?: (appointment: Appointment) => void;
  onTimeSlotClick?: (date: Date, time: string) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({ 
  onAppointmentClick, 
  onTimeSlotClick 
}) => {
  const { appointments } = useAppointments();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewType, setViewType] = useState<ViewType>('week');

  const getAppointmentsForDate = (date: Date) => {
    return appointments.filter(apt => 
      isSameDay(new Date(apt.date), date) && apt.status !== 'cancelled'
    );
  };

  const navigatePrevious = () => {
    switch (viewType) {
      case 'day':
        setCurrentDate(prev => addDays(prev, -1));
        break;
      case 'week':
        setCurrentDate(prev => subWeeks(prev, 1));
        break;
      case 'month':
        setCurrentDate(prev => subMonths(prev, 1));
        break;
    }
  };

  const navigateNext = () => {
    switch (viewType) {
      case 'day':
        setCurrentDate(prev => addDays(prev, 1));
        break;
      case 'week':
        setCurrentDate(prev => addWeeks(prev, 1));
        break;
      case 'month':
        setCurrentDate(prev => addMonths(prev, 1));
        break;
    }
  };

  const renderDayView = () => {
    const dayAppointments = getAppointmentsForDate(currentDate);
    const hours = Array.from({ length: 12 }, (_, i) => i + 8); // 8h à 19h

    return (
      <div className="space-y-2">
        {hours.map(hour => {
          const timeSlot = `${String(hour).padStart(2, '0')}:00`;
          const appointmentsAtHour = dayAppointments.filter(apt => 
            apt.startTime.startsWith(String(hour).padStart(2, '0'))
          );

          return (
            <div key={hour} className="flex items-center border-b pb-2">
              <div className="w-16 text-sm text-muted-foreground">
                {timeSlot}
              </div>
              <div className="flex-1 min-h-[60px] relative">
                {appointmentsAtHour.map(appointment => (
                  <Card 
                    key={appointment.id}
                    className="mb-1 cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => onAppointmentClick?.(appointment)}
                  >
                    <CardContent className="p-2">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: appointment.consultationType.color }}
                        />
                        <span className="font-medium text-sm">
                          {appointment.patientName}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {appointment.startTime} - {appointment.endTime}
                        </Badge>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {appointment.consultationType.name}
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {appointmentsAtHour.length === 0 && (
                  <Button
                    variant="ghost"
                    className="w-full h-full justify-start text-muted-foreground hover:bg-muted/50"
                    onClick={() => onTimeSlotClick?.(currentDate, timeSlot)}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Ajouter un RDV
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderWeekView = () => {
    const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
    const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

    return (
      <div className="grid grid-cols-1 md:grid-cols-7 gap-2">
        {weekDays.map(day => {
          const dayAppointments = getAppointmentsForDate(day);
          const isToday = isSameDay(day, new Date());

          return (
            <Card key={day.toISOString()} className={isToday ? 'ring-2 ring-primary' : ''}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-center">
                  {format(day, 'EEE dd', { locale: fr })}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-1">
                {dayAppointments.map(appointment => (
                  <div
                    key={appointment.id}
                    className="p-2 rounded text-xs cursor-pointer hover:bg-muted/50"
                    style={{ borderLeft: `3px solid ${appointment.consultationType.color}` }}
                    onClick={() => onAppointmentClick?.(appointment)}
                  >
                    <div className="font-medium">{appointment.startTime}</div>
                    <div className="truncate">{appointment.patientName}</div>
                  </div>
                ))}
                {dayAppointments.length === 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full text-xs h-8"
                    onClick={() => onTimeSlotClick?.(day, '09:00')}
                  >
                    <Plus className="w-3 h-3" />
                  </Button>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    );
  };

  const renderMonthView = () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
    const endDate = addDays(startOfWeek(addDays(monthEnd, 7), { weekStartsOn: 1 }), -1);
    
    const days = eachDayOfInterval({ start: startDate, end: endDate });

    return (
      <div className="grid grid-cols-7 gap-1">
        {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map(day => (
          <div key={day} className="p-2 text-center text-sm font-medium text-muted-foreground">
            {day}
          </div>
        ))}
        {days.map(day => {
          const dayAppointments = getAppointmentsForDate(day);
          const isCurrentMonth = day.getMonth() === currentDate.getMonth();
          const isToday = isSameDay(day, new Date());

          return (
            <Card 
              key={day.toISOString()}
              className={`min-h-[80px] ${!isCurrentMonth ? 'opacity-50' : ''} ${isToday ? 'ring-2 ring-primary' : ''}`}
            >
              <CardContent className="p-1">
                <div className="text-sm font-medium mb-1">
                  {format(day, 'd')}
                </div>
                <div className="space-y-1">
                  {dayAppointments.slice(0, 2).map(appointment => (
                    <div
                      key={appointment.id}
                      className="text-xs p-1 rounded cursor-pointer"
                      style={{ backgroundColor: `${appointment.consultationType.color}20` }}
                      onClick={() => onAppointmentClick?.(appointment)}
                    >
                      {appointment.startTime}
                    </div>
                  ))}
                  {dayAppointments.length > 2 && (
                    <div className="text-xs text-muted-foreground">
                      +{dayAppointments.length - 2} autres
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    );
  };

  const getTitle = () => {
    switch (viewType) {
      case 'day':
        return format(currentDate, 'EEEE dd MMMM yyyy', { locale: fr });
      case 'week':
        const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
        const weekEnd = addDays(weekStart, 6);
        return `${format(weekStart, 'dd MMM', { locale: fr })} - ${format(weekEnd, 'dd MMM yyyy', { locale: fr })}`;
      case 'month':
        return format(currentDate, 'MMMM yyyy', { locale: fr });
    }
  };

  return (
    <div className="space-y-4">
      {/* En-tête avec navigation */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={navigatePrevious}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={navigateNext}>
            <ChevronRight className="w-4 h-4" />
          </Button>
          <h2 className="text-lg font-semibold capitalize">{getTitle()}</h2>
        </div>
        
        <div className="flex gap-1">
          {(['day', 'week', 'month'] as ViewType[]).map(type => (
            <Button
              key={type}
              variant={viewType === type ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewType(type)}
            >
              {type === 'day' ? 'Jour' : type === 'week' ? 'Semaine' : 'Mois'}
            </Button>
          ))}
        </div>
      </div>

      {/* Vue calendrier */}
      <div className="min-h-[400px]">
        {viewType === 'day' && renderDayView()}
        {viewType === 'week' && renderWeekView()}
        {viewType === 'month' && renderMonthView()}
      </div>
    </div>
  );
};
