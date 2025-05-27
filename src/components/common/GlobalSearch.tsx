
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Search, User, Calendar, Receipt, FileText } from 'lucide-react';
import { usePatients } from '@/contexts/PatientContext';
import { useAppointments } from '@/contexts/AppointmentContext';
import { useBilling } from '@/contexts/BillingContext';
import { useNavigate } from 'react-router-dom';

interface SearchResult {
  id: string;
  type: 'patient' | 'appointment' | 'invoice';
  title: string;
  subtitle: string;
  data: any;
}

export const GlobalSearch: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  
  const { patients } = usePatients();
  const { appointments } = useAppointments();
  const { invoices } = useBilling();
  const navigate = useNavigate();

  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      return;
    }

    const searchResults: SearchResult[] = [];
    const lowercaseQuery = query.toLowerCase();

    // Search patients
    patients.forEach(patient => {
      if (
        patient.firstName.toLowerCase().includes(lowercaseQuery) ||
        patient.lastName.toLowerCase().includes(lowercaseQuery) ||
        patient.phone.includes(query) ||
        patient.email?.toLowerCase().includes(lowercaseQuery)
      ) {
        searchResults.push({
          id: patient.id,
          type: 'patient',
          title: `${patient.firstName} ${patient.lastName}`,
          subtitle: `${patient.phone} • ${patient.email || ''}`,
          data: patient
        });
      }
    });

    // Search appointments
    appointments.forEach(appointment => {
      const patient = patients.find(p => p.id === appointment.patientId);
      if (
        patient &&
        (patient.firstName.toLowerCase().includes(lowercaseQuery) ||
         patient.lastName.toLowerCase().includes(lowercaseQuery) ||
         appointment.type.toLowerCase().includes(lowercaseQuery))
      ) {
        searchResults.push({
          id: appointment.id,
          type: 'appointment',
          title: `RDV ${appointment.type}`,
          subtitle: `${patient.firstName} ${patient.lastName} • ${appointment.date.toLocaleDateString()}`,
          data: appointment
        });
      }
    });

    // Search invoices
    invoices.forEach(invoice => {
      if (
        invoice.invoiceNumber.toLowerCase().includes(lowercaseQuery) ||
        invoice.patientName.toLowerCase().includes(lowercaseQuery)
      ) {
        searchResults.push({
          id: invoice.id,
          type: 'invoice',
          title: `Facture ${invoice.invoiceNumber}`,
          subtitle: `${invoice.patientName} • ${invoice.total.toLocaleString()} FCFA`,
          data: invoice
        });
      }
    });

    setResults(searchResults.slice(0, 10));
  }, [query, patients, appointments, invoices]);

  const handleResultClick = (result: SearchResult) => {
    switch (result.type) {
      case 'patient':
        navigate(`/patients/${result.id}`);
        break;
      case 'appointment':
        navigate('/appointments');
        break;
      case 'invoice':
        navigate('/billing');
        break;
    }
    setIsOpen(false);
    setQuery('');
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'patient': return <User className="h-4 w-4" />;
      case 'appointment': return <Calendar className="h-4 w-4" />;
      case 'invoice': return <Receipt className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'patient': return <Badge variant="secondary">Patient</Badge>;
      case 'appointment': return <Badge variant="outline">RDV</Badge>;
      case 'invoice': return <Badge>Facture</Badge>;
      default: return <Badge variant="secondary">Autre</Badge>;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full md:w-64">
          <Search className="h-4 w-4 mr-2" />
          Recherche globale...
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Recherche Globale</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Rechercher patients, rendez-vous, factures..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-10"
              autoFocus
            />
          </div>

          {results.length > 0 && (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {results.map((result) => (
                <Card 
                  key={`${result.type}-${result.id}`}
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => handleResultClick(result)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {getIcon(result.type)}
                        <div>
                          <div className="font-medium">{result.title}</div>
                          <div className="text-sm text-gray-500">{result.subtitle}</div>
                        </div>
                      </div>
                      {getTypeBadge(result.type)}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {query.length >= 2 && results.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              Aucun résultat trouvé pour "{query}"
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
