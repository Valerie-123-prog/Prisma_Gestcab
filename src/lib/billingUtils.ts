import { Invoice, InvoiceItem } from '@/types/billing';

export function calculateInvoiceTotal(items: Pick<InvoiceItem, 'quantity' | 'unitPrice'>[]): number {
  return items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
}

export function derivePaymentStatus(totalPaid: number, invoiceTotal: number): Invoice['status'] {
  if (totalPaid >= invoiceTotal) return 'paid';
  if (totalPaid > 0) return 'partially_paid';
  return 'unpaid';
}

/**
 * Calcule le prochain numéro de facture en croisant le compteur des paramètres
 * avec le plus grand numéro déjà émis, pour limiter les collisions lorsque le
 * compteur local est en retard (ex. autre navigateur, stockage réinitialisé).
 * La vraie garantie d'unicité viendra d'une séquence côté base de données.
 */
export function getNextInvoiceNumber(invoices: Pick<Invoice, 'invoiceNumber'>[], prefix: string, counter: number): number {
  const maxIssued = invoices.reduce((max, invoice) => {
    if (!invoice.invoiceNumber.startsWith(`${prefix}-`)) return max;
    const numericPart = Number(invoice.invoiceNumber.slice(prefix.length + 1));
    return Number.isInteger(numericPart) ? Math.max(max, numericPart) : max;
  }, 0);
  return Math.max(counter, maxIssued + 1);
}

export function formatInvoiceNumber(prefix: string, number: number): string {
  return `${prefix}-${number.toString().padStart(4, '0')}`;
}
