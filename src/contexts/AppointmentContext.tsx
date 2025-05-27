
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Appointment, ConsultationType, TimeSlot, WorkingHours, Holiday, WaitingListEntry } from '@/types/appointment';

interface AppointmentContextType {
  appointments: Appointment[];
  consultationTypes: ConsultationType[];
  workingHours: WorkingHours[];
  holidays: Holiday[];
  waitingList: WaitingListEntry[];
  addAppointment: (appointment: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateAppointment: (id: string, appointment: Partial<Appointment>) => void;
  cancelAppointment: (id: string) => void;
  deleteAppointment: (id: string) => void;
  getAvailableSlots: (date: Date, consultationType: ConsultationType) => TimeSlot[];
  addToWaitingList: (entry: Omit<WaitingListEntry, 'id' | 'createdAt'>) => void;
  removeFromWaitingList: (id: string) => void;
  addConsultationType: (type: Omit<ConsultationType, 'id'>) => void;
  updateWorkingHours: (hours: WorkingHours[]) => void;
  addHoliday: (holiday: Omit<Holiday, 'id'>) => void;
}

const AppointmentContext = createContext<AppointmentContextType | undefined>(undefined);

export const useAppointments = () => {
  const context = useContext(AppointmentContext);
  if (!context) {
    throw new Error('useAppointments must be used within an AppointmentProvider');
  }
  return context;
};

export const AppointmentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [consultationTypes, setConsultationTypes] = useState<ConsultationType[]>([
    { id: '1', name: 'Consultation générale', duration: 30, color: '#3b82f6' },
    { id: '2', name: 'Contrôle', duration: 15, color: '#10b981' },
    { id: '3', name: 'Urgence', duration: 45, color: '#ef4444' },
  ]);
  const [workingHours, setWorkingHours] = useState<WorkingHours[]>([
    { dayOfWeek: 1, startTime: '08:00', endTime: '18:00', isActive: true },
    { dayOfWeek: 2, startTime: '08:00', endTime: '18:00', isActive: true },
    { dayOfWeek: 3, startTime: '08:00', endTime: '18:00', isActive: true },
    { dayOfWeek: 4, startTime: '08:00', endTime: '18:00', isActive: true },
    { dayOfWeek: 5, startTime: '08:00', endTime: '17:00', isActive: true },
    { dayOfWeek: 6, startTime: '09:00', endTime: '12:00', isActive: false },
    { dayOfWeek: 0, startTime: '00:00', endTime: '00:00', isActive: false },
  ]);
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [waitingList, setWaitingList] = useState<WaitingListEntry[]>([]);

  // Charger les données depuis localStorage
  useEffect(() => {
    const savedAppointments = localStorage.getItem('appointments');
    if (savedAppointments) {
      const parsedAppointments = JSON.parse(savedAppointments, (key, value) => {
        if (key === 'date' || key === 'createdAt' || key === 'updatedAt') {
          return new Date(value);
        }
        return value;
      });
      setAppointments(parsedAppointments);
    }

    const savedHolidays = localStorage.getItem('holidays');
    if (savedHolidays) {
      const parsedHolidays = JSON.parse(savedHolidays, (key, value) => {
        if (key === 'date') {
          return new Date(value);
        }
        return value;
      });
      setHolidays(parsedHolidays);
    }

    const savedWaitingList = localStorage.getItem('waitingList');
    if (savedWaitingList) {
      const parsedWaitingList = JSON.parse(savedWaitingList, (key, value) => {
        if (key === 'preferredDate' || key === 'createdAt') {
          return value ? new Date(value) : undefined;
        }
        return value;
      });
      setWaitingList(parsedWaitingList);
    }
  }, []);

  // Sauvegarder dans localStorage
  useEffect(() => {
    localStorage.setItem('appointments', JSON.stringify(appointments));
  }, [appointments]);

  useEffect(() => {
    localStorage.setItem('holidays', JSON.stringify(holidays));
  }, [holidays]);

  useEffect(() => {
    localStorage.setItem('waitingList', JSON.stringify(waitingList));
  }, [waitingList]);

  const addAppointment = (appointmentData: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newAppointment: Appointment = {
      ...appointmentData,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setAppointments(prev => [...prev, newAppointment]);
  };

  const updateAppointment = (id: string, updates: Partial<Appointment>) => {
    setAppointments(prev => prev.map(appointment => 
      appointment.id === id 
        ? { ...appointment, ...updates, updatedAt: new Date() }
        : appointment
    ));
  };

  const cancelAppointment = (id: string) => {
    updateAppointment(id, { status: 'cancelled' });
  };

  const deleteAppointment = (id: string) => {
    setAppointments(prev => prev.filter(appointment => appointment.id !== id));
  };

  const getAvailableSlots = (date: Date, consultationType: ConsultationType): TimeSlot[] => {
    const dayOfWeek = date.getDay();
    const workingDay = workingHours.find(wh => wh.dayOfWeek === dayOfWeek && wh.isActive);
    
    if (!workingDay) return [];

    // Vérifier si c'est un jour férié
    const isHoliday = holidays.some(holiday => {
      const holidayDate = new Date(holiday.date);
      return holidayDate.toDateString() === date.toDateString();
    });

    if (isHoliday) return [];

    const slots: TimeSlot[] = [];
    const startTime = workingDay.startTime;
    const endTime = workingDay.endTime;
    const duration = consultationType.duration;

    // Générer les créneaux
    let currentTime = startTime;
    while (currentTime < endTime) {
      const endSlotTime = addMinutesToTime(currentTime, duration);
      if (endSlotTime <= endTime) {
        // Vérifier si le créneau est disponible
        const isBooked = appointments.some(apt => {
          const aptDate = new Date(apt.date);
          return aptDate.toDateString() === date.toDateString() &&
                 apt.startTime === currentTime &&
                 apt.status !== 'cancelled';
        });

        slots.push({
          start: currentTime,
          end: endSlotTime,
          available: !isBooked,
        });
      }
      currentTime = addMinutesToTime(currentTime, 15); // Créneaux toutes les 15 minutes
    }

    return slots;
  };

  const addToWaitingList = (entryData: Omit<WaitingListEntry, 'id' | 'createdAt'>) => {
    const newEntry: WaitingListEntry = {
      ...entryData,
      id: crypto.randomUUID(),
      createdAt: new Date(),
    };
    setWaitingList(prev => [...prev, newEntry]);
  };

  const removeFromWaitingList = (id: string) => {
    setWaitingList(prev => prev.filter(entry => entry.id !== id));
  };

  const addConsultationType = (typeData: Omit<ConsultationType, 'id'>) => {
    const newType: ConsultationType = {
      ...typeData,
      id: crypto.randomUUID(),
    };
    setConsultationTypes(prev => [...prev, newType]);
  };

  const updateWorkingHours = (hours: WorkingHours[]) => {
    setWorkingHours(hours);
  };

  const addHoliday = (holidayData: Omit<Holiday, 'id'>) => {
    const newHoliday: Holiday = {
      ...holidayData,
      id: crypto.randomUUID(),
    };
    setHolidays(prev => [...prev, newHoliday]);
  };

  const value: AppointmentContextType = {
    appointments,
    consultationTypes,
    workingHours,
    holidays,
    waitingList,
    addAppointment,
    updateAppointment,
    cancelAppointment,
    deleteAppointment,
    getAvailableSlots,
    addToWaitingList,
    removeFromWaitingList,
    addConsultationType,
    updateWorkingHours,
    addHoliday,
  };

  return (
    <AppointmentContext.Provider value={value}>
      {children}
    </AppointmentContext.Provider>
  );
};

// Fonction utilitaire pour ajouter des minutes à une heure
function addMinutesToTime(time: string, minutes: number): string {
  const [hours, mins] = time.split(':').map(Number);
  const totalMinutes = hours * 60 + mins + minutes;
  const newHours = Math.floor(totalMinutes / 60);
  const newMins = totalMinutes % 60;
  return `${String(newHours).padStart(2, '0')}:${String(newMins).padStart(2, '0')}`;
}
