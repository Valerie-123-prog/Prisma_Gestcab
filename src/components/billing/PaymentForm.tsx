
import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Invoice, PaymentFormData, PaymentMethod } from '@/types/billing';
import { useBilling } from '@/contexts/BillingContext';
import { useToast } from '@/hooks/use-toast';

interface PaymentFormProps {
  invoice: Invoice;
  onSuccess: () => void;
}

export const PaymentForm: React.FC<PaymentFormProps> = ({ invoice, onSuccess }) => {
  const { addPayment } = useBilling();
  const { toast } = useToast();

  const remainingAmount = invoice.total - invoice.amountPaid;

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<PaymentFormData>({
    defaultValues: {
      amount: remainingAmount,
      method: 'cash',
      date: new Date(),
      notes: ''
    }
  });

  const selectedMethod = watch('method');

  const onSubmit = (data: PaymentFormData) => {
    if (data.amount <= 0) {
      toast({
        title: "Erreur",
        description: "Le montant doit être supérieur à 0",
        variant: "destructive",
      });
      return;
    }

    if (data.amount > remainingAmount) {
      toast({
        title: "Erreur",
        description: "Le montant ne peut pas dépasser le reste à payer",
        variant: "destructive",
      });
      return;
    }

    addPayment({
      invoiceId: invoice.id,
      amount: data.amount,
      method: data.method,
      date: data.date,
      notes: data.notes,
    });

    toast({
      title: "Succès",
      description: "Paiement enregistré avec succès",
    });

    onSuccess();
  };

  const getPaymentMethodLabel = (method: PaymentMethod) => {
    switch (method) {
      case 'cash': return 'Espèces';
      case 'mobile_money': return 'Mobile Money';
      case 'check': return 'Chèque';
      case 'transfer': return 'Virement';
      default: return method;
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Informations facture */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="font-semibold mb-2">Facture {invoice.invoiceNumber}</h3>
        <p className="text-sm text-gray-600">Patient: {invoice.patientName}</p>
        <p className="text-sm text-gray-600">
          Total: {invoice.total.toLocaleString()} FCFA
        </p>
        <p className="text-sm text-gray-600">
          Déjà payé: {invoice.amountPaid.toLocaleString()} FCFA
        </p>
        <p className="text-sm font-semibold text-red-600">
          Reste à payer: {remainingAmount.toLocaleString()} FCFA
        </p>
      </div>

      {/* Montant */}
      <div>
        <Label htmlFor="amount">Montant à payer (FCFA) *</Label>
        <Input
          id="amount"
          type="number"
          min="1"
          max={remainingAmount}
          {...register('amount', { 
            required: 'Le montant est requis',
            min: { value: 1, message: 'Le montant doit être supérieur à 0' },
            max: { value: remainingAmount, message: 'Le montant ne peut pas dépasser le reste à payer' },
            valueAsNumber: true
          })}
        />
        {errors.amount && (
          <p className="text-sm text-red-600 mt-1">{errors.amount.message}</p>
        )}
      </div>

      {/* Mode de paiement */}
      <div>
        <Label htmlFor="method">Mode de paiement *</Label>
        <Select 
          value={selectedMethod} 
          onValueChange={(value) => setValue('method', value as PaymentMethod)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="cash">Espèces</SelectItem>
            <SelectItem value="mobile_money">Mobile Money</SelectItem>
            <SelectItem value="check">Chèque</SelectItem>
            <SelectItem value="transfer">Virement</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Date de paiement */}
      <div>
        <Label htmlFor="date">Date de paiement *</Label>
        <Input
          id="date"
          type="date"
          {...register('date', { 
            required: 'La date est requise',
            valueAsDate: true 
          })}
        />
        {errors.date && (
          <p className="text-sm text-red-600 mt-1">{errors.date.message}</p>
        )}
      </div>

      {/* Notes */}
      <div>
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          {...register('notes')}
          placeholder="Notes sur le paiement..."
          rows={3}
        />
      </div>

      {/* Actions */}
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onSuccess}>
          Annuler
        </Button>
        <Button type="submit">
          Enregistrer le Paiement
        </Button>
      </div>
    </form>
  );
};
