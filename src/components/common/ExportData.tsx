import React from 'react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Download, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { buildCsv } from '@/lib/csv';
import { Patient } from '@/types/patient';
import { Appointment } from '@/types/appointment';
import { Invoice } from '@/types/billing';

type ExportDataProps =
  | { data: Patient[]; filename: string; type: 'patients' }
  | { data: Appointment[]; filename: string; type: 'appointments' }
  | { data: Invoice[]; filename: string; type: 'invoices' };

const INVOICE_STATUS_LABELS: Record<Invoice['status'], string> = {
  paid: 'Payée',
  partially_paid: 'Partiellement payée',
  unpaid: 'Impayée',
};

function getCsvContent(props: ExportDataProps): string {
  switch (props.type) {
    case 'patients':
      return buildCsv(
        ['Prénom', 'Nom', 'Date de naissance', 'Téléphone', 'Email', 'Adresse'],
        props.data.map(p => [p.firstName, p.lastName, p.dateOfBirth, p.phone, p.email ?? '', p.address])
      );
    case 'appointments':
      return buildCsv(
        ['Date', 'Début', 'Fin', 'Patient', 'Type', 'Statut'],
        props.data.map(a => [a.date, a.startTime, a.endTime, a.patientName, a.consultationType.name, a.status])
      );
    case 'invoices':
      return buildCsv(
        ['Numéro', 'Patient', 'Date', 'Échéance', 'Total (FCFA)', 'Payé (FCFA)', 'Statut'],
        props.data.map(i => [i.invoiceNumber, i.patientName, i.date, i.dueDate, i.total, i.amountPaid, INVOICE_STATUS_LABELS[i.status]])
      );
  }
}

function getTextContent(props: ExportDataProps): string {
  switch (props.type) {
    case 'patients':
      return props.data.map(p => `${p.firstName} ${p.lastName} - ${p.phone}`).join('\n');
    case 'appointments':
      return props.data.map(a => `${a.date.toLocaleDateString('fr-FR')} ${a.startTime} - ${a.patientName} (${a.consultationType.name})`).join('\n');
    case 'invoices':
      return props.data.map(i => `${i.invoiceNumber} - ${i.patientName} - ${i.total} FCFA`).join('\n');
  }
}

function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  window.URL.revokeObjectURL(url);
}

export const ExportData: React.FC<ExportDataProps> = (props) => {
  const { data, filename } = props;
  const { toast } = useToast();

  const exportToText = () => {
    downloadFile(getTextContent(props), `${filename}.txt`, 'text/plain;charset=utf-8;');
    toast({
      title: 'Export réussi',
      description: `${data.length} éléments exportés en fichier texte`,
    });
  };

  const exportToCsv = () => {
    downloadFile(getCsvContent(props), `${filename}.csv`, 'text/csv;charset=utf-8;');
    toast({
      title: 'Export réussi',
      description: `${data.length} éléments exportés en CSV`,
    });
  };

  if (data.length === 0) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Exporter ({data.length})
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={exportToCsv}>
          <FileText className="h-4 w-4 mr-2" />
          Exporter en CSV (Excel)
        </DropdownMenuItem>
        <DropdownMenuItem onClick={exportToText}>
          <FileText className="h-4 w-4 mr-2" />
          Exporter en texte (.txt)
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
