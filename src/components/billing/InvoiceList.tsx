
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Eye, Edit, Trash2, CreditCard } from 'lucide-react';
import { Invoice } from '@/types/billing';
import { useBilling } from '@/contexts/BillingContext';
import { InvoiceDetail } from './InvoiceDetail';
import { PaymentForm } from './PaymentForm';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface InvoiceListProps {
  invoices: Invoice[];
  showOnlyUnpaid?: boolean;
}

export const InvoiceList: React.FC<InvoiceListProps> = ({ invoices, showOnlyUnpaid = false }) => {
  const { deleteInvoice } = useBilling();
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);

  const getStatusBadge = (status: Invoice['status']) => {
    switch (status) {
      case 'paid':
        return <Badge className="bg-green-100 text-green-800">Payée</Badge>;
      case 'partially_paid':
        return <Badge className="bg-yellow-100 text-yellow-800">Partiellement payée</Badge>;
      case 'unpaid':
        return <Badge className="bg-red-100 text-red-800">Impayée</Badge>;
      default:
        return null;
    }
  };

  const handleViewInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setIsDetailOpen(true);
  };

  const handlePayment = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setIsPaymentOpen(true);
  };

  const handleDelete = (invoice: Invoice) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette facture ?')) {
      deleteInvoice(invoice.id);
    }
  };

  if (invoices.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <p className="text-gray-500">
              {showOnlyUnpaid ? 'Aucune facture impayée' : 'Aucune facture trouvée'}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {invoices.map((invoice) => (
          <Card key={invoice.id}>
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold">{invoice.invoiceNumber}</h3>
                    {getStatusBadge(invoice.status)}
                  </div>
                  <p className="text-gray-600">{invoice.patientName}</p>
                  <p className="text-sm text-gray-500">
                    Date: {format(invoice.date, 'dd MMMM yyyy', { locale: fr })} • 
                    Échéance: {format(invoice.dueDate, 'dd MMMM yyyy', { locale: fr })}
                  </p>
                  <p className="text-lg font-bold text-green-600 mt-2">
                    {invoice.total.toLocaleString()} FCFA
                  </p>
                  {invoice.amountPaid > 0 && (
                    <p className="text-sm text-gray-600">
                      Payé: {invoice.amountPaid.toLocaleString()} FCFA
                    </p>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewInvoice(invoice)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>

                  {invoice.status !== 'paid' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePayment(invoice)}
                    >
                      <CreditCard className="h-4 w-4" />
                    </Button>
                  )}

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(invoice)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Dialog pour voir les détails */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Détails de la Facture</DialogTitle>
          </DialogHeader>
          {selectedInvoice && (
            <InvoiceDetail 
              invoice={selectedInvoice} 
              onClose={() => setIsDetailOpen(false)} 
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog pour les paiements */}
      <Dialog open={isPaymentOpen} onOpenChange={setIsPaymentOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Enregistrer un Paiement</DialogTitle>
          </DialogHeader>
          {selectedInvoice && (
            <PaymentForm 
              invoice={selectedInvoice} 
              onSuccess={() => setIsPaymentOpen(false)} 
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
