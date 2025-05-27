
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Receipt, Plus, BarChart3, Settings } from 'lucide-react';
import { useBilling } from '@/contexts/BillingContext';
import { InvoiceForm } from '@/components/billing/InvoiceForm';
import { InvoiceList } from '@/components/billing/InvoiceList';
import { BillingStats } from '@/components/billing/BillingStats';
import { BillingSettings } from '@/components/billing/BillingSettings';

const Billing = () => {
  const { invoices, searchInvoices, getTotalRevenue, getUnpaidInvoices } = useBilling();
  const [searchQuery, setSearchQuery] = useState('');
  const [isInvoiceDialogOpen, setIsInvoiceDialogOpen] = useState(false);
  const [isSettingsDialogOpen, setIsSettingsDialogOpen] = useState(false);

  const filteredInvoices = searchInvoices(searchQuery);
  const totalRevenue = getTotalRevenue();
  const unpaidInvoices = getUnpaidInvoices();

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* En-tête */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-2">
            <Receipt className="h-8 w-8 text-green-600" />
            <h1 className="text-3xl font-bold text-gray-900">Gestion de la Facturation</h1>
          </div>
          
          <div className="flex gap-2">
            <Dialog open={isSettingsDialogOpen} onOpenChange={setIsSettingsDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Settings className="h-4 w-4 mr-2" />
                  Paramètres
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Paramètres de Facturation</DialogTitle>
                </DialogHeader>
                <BillingSettings onSuccess={() => setIsSettingsDialogOpen(false)} />
              </DialogContent>
            </Dialog>

            <Dialog open={isInvoiceDialogOpen} onOpenChange={setIsInvoiceDialogOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Nouvelle Facture
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Créer une Nouvelle Facture</DialogTitle>
                </DialogHeader>
                <InvoiceForm onSuccess={() => setIsInvoiceDialogOpen(false)} />
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Onglets */}
        <Tabs defaultValue="invoices" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="invoices">Factures</TabsTrigger>
            <TabsTrigger value="stats">Statistiques</TabsTrigger>
            <TabsTrigger value="unpaid">Impayées</TabsTrigger>
          </TabsList>

          <TabsContent value="invoices" className="space-y-6">
            {/* Barre de recherche */}
            <Card>
              <CardContent className="pt-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Rechercher par patient, numéro de facture ou montant..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Statistiques rapides */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Total Factures</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">{invoices.length}</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Chiffre d'Affaires</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">
                    {totalRevenue.toLocaleString()} FCFA
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Factures Impayées</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">{unpaidInvoices.length}</div>
                </CardContent>
              </Card>
            </div>

            {/* Liste des factures */}
            <InvoiceList invoices={filteredInvoices} />
          </TabsContent>

          <TabsContent value="stats">
            <BillingStats />
          </TabsContent>

          <TabsContent value="unpaid">
            <InvoiceList invoices={unpaidInvoices} showOnlyUnpaid />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Billing;
