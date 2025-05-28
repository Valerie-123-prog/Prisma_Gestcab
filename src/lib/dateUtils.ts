
import { format, formatDistance, formatRelative } from 'date-fns';
import { fr } from 'date-fns/locale';

// Configuration française pour les dates
export const frenchDateConfig = {
  locale: fr,
  weekStartsOn: 1 as const, // Lundi
};

// Formatters de dates en français
export const formatDateFr = (date: Date, formatStr: string = 'dd/MM/yyyy') => {
  return format(date, formatStr, frenchDateConfig);
};

export const formatDateTimeFr = (date: Date) => {
  return format(date, 'dd/MM/yyyy à HH:mm', frenchDateConfig);
};

export const formatTimeFr = (date: Date) => {
  return format(date, 'HH:mm', frenchDateConfig);
};

export const formatDateLongFr = (date: Date) => {
  return format(date, 'EEEE dd MMMM yyyy', frenchDateConfig);
};

export const formatDateShortFr = (date: Date) => {
  return format(date, 'dd MMM', frenchDateConfig);
};

export const formatRelativeFr = (date: Date, baseDate: Date = new Date()) => {
  return formatRelative(date, baseDate, frenchDateConfig);
};

export const formatDistanceFr = (date: Date, baseDate: Date = new Date()) => {
  return formatDistance(date, baseDate, { ...frenchDateConfig, addSuffix: true });
};

// Noms des jours en français
export const dayNamesFr = [
  'Dimanche',
  'Lundi',
  'Mardi',
  'Mercredi',
  'Jeudi',
  'Vendredi',
  'Samedi'
];

export const dayNamesShortFr = [
  'Dim',
  'Lun',
  'Mar',
  'Mer',
  'Jeu',
  'Ven',
  'Sam'
];

// Noms des mois en français
export const monthNamesFr = [
  'Janvier',
  'Février',
  'Mars',
  'Avril',
  'Mai',
  'Juin',
  'Juillet',
  'Août',
  'Septembre',
  'Octobre',
  'Novembre',
  'Décembre'
];
