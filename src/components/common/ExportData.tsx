
import React from 'react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Download, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ExportDataProps {
  data: any[];
  filename: string;
  type: 'patients' | 'appointments' | 'invoices';
}

export const ExportData: React.FC<ExportDataProps> = ({ data, filename, type }) => {
  const { toast } = useToast();

  const exportToPDF = () => {
    // Simulation d'export PDF
    const content = data.map(item => {
      switch (type) {
        case 'patients':
          return `${item.firstName} ${item.lastName} - ${item.phone}`;
        case 'appointments':
          return `${item.date.toLocaleDateString()} - ${item.type}`;
        case 'invoices':
          return `${item.invoiceNumber} - ${item.total} FCFA`;
        default:
          return JSON.stringify(item);
      }
    }).join('\n');

    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.txt`;
    a.click();
    window.URL.revokeObjectURL(url);

    toast({
      title: "Export réussi",
      description: `${data.length} éléments exportés en PDF`,
    });
  };

  const exportToExcel = () => {
    // Simulation d'export Excel (CSV)
    let csvContent = '';
    
    if (data.length > 0) {
      // Headers
      const headers = Object.keys(data[0]).join(',');
      csvContent += headers + '\n';
      
      // Data rows
      data.forEach(item => {
        const values = Object.values(item).map(value => {
          if (value instanceof Date) {
            return value.toLocaleDateString();
          }
          return typeof value === 'string' ? `"${value}"` : value;
        }).join(',');
        csvContent += values + '\n';
      });
    }

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    toast({
      title: "Export réussi",
      description: `${data.length} éléments exportés en Excel`,
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
        <DropdownMenuItem onClick={exportToPDF}>
          <FileText className="h-4 w-4 mr-2" />
          Exporter en PDF
        </DropdownMenuItem>
        <DropdownMenuItem onClick={exportToExcel}>
          <FileText className="h-4 w-4 mr-2" />
          Exporter en Excel
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
