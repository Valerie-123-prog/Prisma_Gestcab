import { describe, expect, it } from 'vitest';
import { calculateInvoiceTotal, derivePaymentStatus, formatInvoiceNumber, getNextInvoiceNumber } from '../billingUtils';

describe('calculateInvoiceTotal', () => {
  it('additionne quantité × prix unitaire', () => {
    expect(calculateInvoiceTotal([
      { quantity: 1, unitPrice: 15000 },
      { quantity: 3, unitPrice: 2000 },
    ])).toBe(21000);
  });

  it('renvoie 0 sans lignes', () => {
    expect(calculateInvoiceTotal([])).toBe(0);
  });
});

describe('derivePaymentStatus', () => {
  it('marque payée une facture réglée intégralement ou au-delà', () => {
    expect(derivePaymentStatus(15000, 15000)).toBe('paid');
    expect(derivePaymentStatus(20000, 15000)).toBe('paid');
  });

  it('marque partiellement payée une facture réglée en partie', () => {
    expect(derivePaymentStatus(5000, 15000)).toBe('partially_paid');
  });

  it('marque impayée une facture sans paiement', () => {
    expect(derivePaymentStatus(0, 15000)).toBe('unpaid');
  });
});

describe('getNextInvoiceNumber', () => {
  it('suit le compteur quand il est en avance sur les factures émises', () => {
    const invoices = [{ invoiceNumber: 'FAC-0001' }, { invoiceNumber: 'FAC-0002' }];
    expect(getNextInvoiceNumber(invoices, 'FAC', 7)).toBe(7);
  });

  it('rattrape le plus grand numéro émis quand le compteur est en retard', () => {
    const invoices = [{ invoiceNumber: 'FAC-0009' }, { invoiceNumber: 'FAC-0004' }];
    expect(getNextInvoiceNumber(invoices, 'FAC', 1)).toBe(10);
  });

  it('ignore les numéros d\'un autre préfixe ou mal formés', () => {
    const invoices = [{ invoiceNumber: 'OLD-0099' }, { invoiceNumber: 'FAC-abc' }, { invoiceNumber: 'FAC-0002' }];
    expect(getNextInvoiceNumber(invoices, 'FAC', 1)).toBe(3);
  });

  it('démarre à 1 sans aucune facture', () => {
    expect(getNextInvoiceNumber([], 'FAC', 1)).toBe(1);
  });
});

describe('formatInvoiceNumber', () => {
  it('complète à 4 chiffres', () => {
    expect(formatInvoiceNumber('FAC', 7)).toBe('FAC-0007');
    expect(formatInvoiceNumber('FAC', 12345)).toBe('FAC-12345');
  });
});
