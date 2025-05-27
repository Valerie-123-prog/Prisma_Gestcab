
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Printer, Download } from 'lucide-react';
import { Invoice } from '@/types/billing';
import { useBilling } from '@/contexts/BillingContext';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface InvoiceDetailProps {
  invoice: Invoice;
  onClose: () => void;
}

export const InvoiceDetail: React.FC<InvoiceDetailProps> = ({ invoice, onClose }) => {
  const { settings } = useBilling();

  const handlePrint = () => {
    window.print();
  };

  const handleExportPDF = () => {
    // Simulation d'export PDF - dans un vrai projet, utiliser une bibliothèque comme jsPDF
    alert('Fonctionnalité d\'export PDF à implémenter');
  };

  const getStatusLabel = (status: Invoice['status']) => {
    switch (status) {
      case 'paid': return 'Payée';
      case 'partially_paid': return 'Partiellement payée';
      case 'unpaid': return 'Impayée';
      default: return status;
    }
  };

  const getPaymentMethodLabel = (method?: string) => {
    switch (method) {
      case 'cash': return 'Espèces';
      case 'mobile_money': return 'Mobile Money';
      case 'check': return 'Chèque';
      case 'transfer': return 'Virement';
      default: return method || '-';
    }
  };

  return (
    <div className="space-y-6">
      {/* Actions */}
      <div className="flex justify-end gap-2 no-print">
        <Button variant="outline" onClick={handlePrint}>
          <Printer className="h-4 w-4 mr-2" />
          Imprimer
        </Button>
        <Button variant="outline" onClick={handleExportPDF}>
          <Download className="h-4 w-4 mr-2" />
          Export PDF
        </Button>
      </div>

      {/* Facture */}
      <Card className="print:shadow-none">
        <CardHeader className="text-center">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold">{settings.clinicName}</h1>
            <p className="text-gray-600">{settings.clinicAddress}</p>
            <p className="text-gray-600">{settings.clinicPhone}</p>
            {settings.clinicEmail && (
              <p className="text-gray-600">{settings.clinicEmail}</p>
            )}
          </div>
          <Separator className="my-4" />
          <CardTitle className="text-xl">FACTURE</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Informations facture */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-2">Informations Facture</h3>
              <div className="space-y-1 text-sm">
                <p><span className="font-medium">Numéro:</span> {invoice.invoiceNumber}</p>
                <p><span className="font-medium">Date:</span> {format(invoice.date, 'dd MMMM yyyy', { locale: fr })}</p>
                <p><span className="font-medium">Échéance:</span> {format(invoice.dueDate, 'dd MMMM yyyy', { locale: fr })}</p>
                <p><span className="font-medium">Statut:</span> 
                  <Badge className="ml-2" variant={invoice.status === 'paid' ? 'default' : 'destructive'}>
                    {getStatusLabel(invoice.status)}
                  </Badge>
                </p>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Patient</h3>
              <div className="space-y-1 text-sm">
                <p><span className="font-medium">Nom:</span> {invoice.patientName}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Articles */}
          <div>
            <h3 className="font-semibold mb-4">Détail des Prestations</h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Description</th>
                    <th className="text-center p-2">Type</th>
                    <th className="text-center p-2">Quantité</th>
                    <th className="text-right p-2">Prix Unitaire</th>
                    <th className="text-right p-2">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.items.map((item) => (
                    <tr key={item.id} className="border-b">
                      <td className="p-2">{item.description}</td>
                      <td className="text-center p-2">
                        {item.type === 'consultation' ? 'Consultation' : 
                         item.type === 'medication' ? 'Médicament' : 'Autre'}
                      </td>
                      <td className="text-center p-2">{item.quantity}</td>
                      <td className="text-right p-2">{item.unitPrice.toLocaleString()} FCFA</td>
                      <td className="text-right p-2">{item.total.toLocaleString()} FCFA</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <Separator />

          {/* Totaux */}
          <div className="flex justify-end">
            <div className="w-full md:w-1/2 space-y-2">
              <div className="flex justify-between">
                <span>Sous-total:</span>
                <span>{invoice.subtotal.toLocaleString()} FCFA</span>
              </div>
              <div className="flex justify-between font-bold text-lg">
                <span>Total:</span>
                <span>{invoice.total.toLocaleString()} FCFA</span>
              </div>
              {invoice.amountPaid > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Montant payé:</span>
                  <span>{invoice.amountPaid.toLocaleString()} FCFA</span>
                </div>
              )}
              {invoice.total - invoice.amountPaid > 0 && (
                <div className="flex justify-between text-red-600">
                  <span>Reste à payer:</span>
                  <span>{(invoice.total - invoice.amountPaid).toLocaleString()} FCFA</span>
                </div>
              )}
            </div>
          </div>

          {/* Informations de paiement */}
          {invoice.paymentMethod && (
            <>
              <Separator />
              <div>
                <h3 className="font-semibold mb-2">Informations de Paiement</h3>
                <p className="text-sm">
                  <span className="font-medium">Mode de paiement:</span> {getPaymentMethodLabel(invoice.paymentMethod)}
                </p>
              </div>
            </>
          )}

          {/* Notes */}
          {invoice.notes && (
            <>
              <Separator />
              <div>
                <h3 className="font-semibold mb-2">Notes</h3>
                <p className="text-sm text-gray-600">{invoice.notes}</p>
              </div>
            </>
          )}

          {/* Pied de page */}
          <Separator />
          <div className="text-center text-sm text-gray-500">
            <p>Merci pour votre confiance</p>
            <p>Facture générée le {format(new Date(), 'dd MMMM yyyy à HH:mm', { locale: fr })}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
