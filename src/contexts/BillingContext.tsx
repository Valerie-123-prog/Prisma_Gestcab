import React, { createContext, useContext, useState, useEffect } from 'react';
import { Invoice, Payment, BillingSettings } from '@/types/billing';
import { usePatients } from './PatientContext';
import { loadFromStorage, saveToStorage } from '@/lib/storage';
import { calculateInvoiceTotal, derivePaymentStatus, formatInvoiceNumber, getNextInvoiceNumber } from '@/lib/billingUtils';

interface BillingContextType {
  invoices: Invoice[];
  payments: Payment[];
  settings: BillingSettings;
  addInvoice: (invoice: Omit<Invoice, 'id' | 'invoiceNumber' | 'subtotal' | 'total' | 'createdAt' | 'updatedAt' | 'status' | 'amountPaid' | 'patientName'>) => void;
  updateInvoice: (id: string, updates: Partial<Invoice>) => void;
  /** Refuse la suppression (renvoie false) si la facture a déjà reçu un paiement. */
  deleteInvoice: (id: string) => boolean;
  getInvoice: (id: string) => Invoice | undefined;
  addPayment: (payment: Omit<Payment, 'id'>) => void;
  updateSettings: (settings: Partial<BillingSettings>) => void;
  searchInvoices: (query: string) => Invoice[];
  getInvoicesByPatient: (patientId: string) => Invoice[];
  getInvoicesByDateRange: (startDate: Date, endDate: Date) => Invoice[];
  getTotalRevenue: (startDate?: Date, endDate?: Date) => number;
  getUnpaidInvoices: () => Invoice[];
}

const BillingContext = createContext<BillingContextType | undefined>(undefined);

export const useBilling = () => {
  const context = useContext(BillingContext);
  if (!context) {
    throw new Error('useBilling must be used within a BillingProvider');
  }
  return context;
};

const defaultSettings: BillingSettings = {
  clinicName: 'Centre Médical',
  clinicAddress: 'Adresse du centre médical, Yaoundé, Cameroun',
  clinicPhone: '+237 6XX XXX XXX',
  clinicEmail: 'contact@centremedical.cm',
  defaultConsultationPrice: 15000,
  invoicePrefix: 'FAC',
  nextInvoiceNumber: 1,
};

export const BillingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [settings, setSettings] = useState<BillingSettings>(defaultSettings);
  const { patients } = usePatients();

  // Charger les données depuis localStorage au démarrage
  useEffect(() => {
    const savedInvoices = loadFromStorage<Invoice[]>('invoices', ['date', 'dueDate', 'createdAt', 'updatedAt']);
    if (savedInvoices) setInvoices(savedInvoices);

    const savedPayments = loadFromStorage<Payment[]>('payments', ['date']);
    if (savedPayments) setPayments(savedPayments);

    const savedSettings = loadFromStorage<BillingSettings>('billingSettings');
    if (savedSettings) setSettings(savedSettings);
  }, []);

  // Sauvegarder dans localStorage à chaque changement
  useEffect(() => {
    saveToStorage('invoices', invoices);
  }, [invoices]);

  useEffect(() => {
    saveToStorage('payments', payments);
  }, [payments]);

  useEffect(() => {
    saveToStorage('billingSettings', settings);
  }, [settings]);

  const generateInvoiceNumber = () => {
    const nextNumber = getNextInvoiceNumber(invoices, settings.invoicePrefix, settings.nextInvoiceNumber);
    setSettings(prev => ({ ...prev, nextInvoiceNumber: nextNumber + 1 }));
    return formatInvoiceNumber(settings.invoicePrefix, nextNumber);
  };

  const addInvoice = (invoiceData: Omit<Invoice, 'id' | 'invoiceNumber' | 'subtotal' | 'total' | 'createdAt' | 'updatedAt' | 'status' | 'amountPaid' | 'patientName'>) => {
    const patient = patients.find(p => p.id === invoiceData.patientId);
    const patientName = patient ? `${patient.firstName} ${patient.lastName}` : 'Patient inconnu';
    
    const itemsWithIds = invoiceData.items.map(item => ({
      ...item,
      id: crypto.randomUUID(),
      total: item.quantity * item.unitPrice
    }));

    const total = calculateInvoiceTotal(itemsWithIds);

    const newInvoice: Invoice = {
      ...invoiceData,
      id: crypto.randomUUID(),
      invoiceNumber: generateInvoiceNumber(),
      patientName,
      date: new Date(),
      items: itemsWithIds,
      subtotal: total,
      total,
      status: 'unpaid',
      amountPaid: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setInvoices(prev => [...prev, newInvoice]);
  };

  const updateInvoice = (id: string, updates: Partial<Invoice>) => {
    setInvoices(prev => prev.map(invoice => 
      invoice.id === id 
        ? { ...invoice, ...updates, updatedAt: new Date() }
        : invoice
    ));
  };

  const deleteInvoice = (id: string) => {
    // Une facture qui a reçu un paiement fait partie de l'historique comptable :
    // elle ne doit pas pouvoir disparaître
    if (payments.some(payment => payment.invoiceId === id)) {
      return false;
    }
    setInvoices(prev => prev.filter(invoice => invoice.id !== id));
    return true;
  };

  const getInvoice = (id: string) => {
    return invoices.find(invoice => invoice.id === id);
  };

  const addPayment = (paymentData: Omit<Payment, 'id'>) => {
    const newPayment: Payment = {
      ...paymentData,
      id: crypto.randomUUID(),
    };

    // La même liste sert à mettre à jour l'état ET à calculer le total payé,
    // pour que le statut de la facture reste cohérent avec les paiements
    const updatedPayments = [...payments, newPayment];
    setPayments(updatedPayments);

    const invoice = getInvoice(paymentData.invoiceId);
    if (invoice) {
      const totalPaid = updatedPayments
        .filter(p => p.invoiceId === paymentData.invoiceId)
        .reduce((sum, p) => sum + p.amount, 0);

      updateInvoice(paymentData.invoiceId, {
        amountPaid: totalPaid,
        status: derivePaymentStatus(totalPaid, invoice.total),
        paymentMethod: paymentData.method
      });
    }
  };

  const updateSettings = (newSettings: Partial<BillingSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const searchInvoices = (query: string): Invoice[] => {
    if (!query.trim()) return invoices;
    
    const lowercaseQuery = query.toLowerCase();
    return invoices.filter(invoice => 
      invoice.patientName.toLowerCase().includes(lowercaseQuery) ||
      invoice.invoiceNumber.toLowerCase().includes(lowercaseQuery) ||
      invoice.total.toString().includes(query)
    );
  };

  const getInvoicesByPatient = (patientId: string): Invoice[] => {
    return invoices.filter(invoice => invoice.patientId === patientId);
  };

  const getInvoicesByDateRange = (startDate: Date, endDate: Date): Invoice[] => {
    return invoices.filter(invoice => 
      invoice.date >= startDate && invoice.date <= endDate
    );
  };

  const getTotalRevenue = (startDate?: Date, endDate?: Date): number => {
    let filteredInvoices = invoices.filter(invoice => invoice.status === 'paid');
    
    if (startDate && endDate) {
      filteredInvoices = filteredInvoices.filter(invoice => 
        invoice.date >= startDate && invoice.date <= endDate
      );
    }
    
    return filteredInvoices.reduce((sum, invoice) => sum + invoice.total, 0);
  };

  const getUnpaidInvoices = (): Invoice[] => {
    return invoices.filter(invoice => invoice.status === 'unpaid' || invoice.status === 'partially_paid');
  };

  const value: BillingContextType = {
    invoices,
    payments,
    settings,
    addInvoice,
    updateInvoice,
    deleteInvoice,
    getInvoice,
    addPayment,
    updateSettings,
    searchInvoices,
    getInvoicesByPatient,
    getInvoicesByDateRange,
    getTotalRevenue,
    getUnpaidInvoices,
  };

  return (
    <BillingContext.Provider value={value}>
      {children}
    </BillingContext.Provider>
  );
};
