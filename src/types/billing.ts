
export interface Invoice {
  id: string;
  patientId: string;
  patientName: string;
  invoiceNumber: string;
  date: Date;
  dueDate: Date;
  items: InvoiceItem[];
  subtotal: number;
  total: number;
  status: 'paid' | 'unpaid' | 'partially_paid';
  paymentMethod?: PaymentMethod;
  amountPaid: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface InvoiceItem {
  id: string;
  type: 'consultation' | 'medication' | 'other';
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Payment {
  id: string;
  invoiceId: string;
  amount: number;
  method: PaymentMethod;
  date: Date;
  notes?: string;
}

export type PaymentMethod = 'cash' | 'mobile_money' | 'check' | 'transfer';

export interface BillingSettings {
  clinicName: string;
  clinicAddress: string;
  clinicPhone: string;
  clinicEmail?: string;
  defaultConsultationPrice: number;
  invoicePrefix: string;
  nextInvoiceNumber: number;
}

export interface InvoiceFormData {
  patientId: string;
  items: Omit<InvoiceItem, 'id' | 'total'>[];
  dueDate: Date;
  notes: string;
}

export interface PaymentFormData {
  amount: number;
  method: PaymentMethod;
  date: Date;
  notes: string;
}
