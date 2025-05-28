
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export const formatDate = (date: Date): string => {
  return format(date, 'dd/MM/yyyy', { locale: fr });
};

export const formatDateTime = (date: Date): string => {
  return format(date, 'dd/MM/yyyy HH:mm', { locale: fr });
};

export const formatCurrency = (amount: number): string => {
  return `${amount.toLocaleString('fr-FR')} FCFA`;
};

export const formatPhone = (phone: string): string => {
  // Format Cameroon phone numbers: +237 6XX XXX XXX
  if (phone.startsWith('+237')) {
    const number = phone.slice(4);
    if (number.length === 9) {
      return `+237 ${number.slice(0, 1)}${number.slice(1, 3)} ${number.slice(3, 6)} ${number.slice(6)}`;
    }
  }
  return phone;
};

export const validateCameroonPhone = (phone: string): boolean => {
  const phoneRegex = /^\+237[67]\d{8}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

export const PAYMENT_METHODS = {
  cash: 'Espèces',
  orange_money: 'Orange Money',
  mtn_mobile_money: 'MTN Mobile Money',
  check: 'Chèque',
  transfer: 'Virement bancaire'
} as const;

export const APPOINTMENT_TYPES = {
  consultation: 'Consultation générale',
  checkup: 'Contrôle',
  emergency: 'Urgence',
  follow_up: 'Suivi',
  vaccination: 'Vaccination'
} as const;
