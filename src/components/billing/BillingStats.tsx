
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useBilling } from '@/contexts/BillingContext';
import { format, startOfMonth, endOfMonth, eachMonthOfInterval, subMonths } from 'date-fns';
import { fr } from 'date-fns/locale';

export const BillingStats: React.FC = () => {
  const { invoices, getTotalRevenue, getInvoicesByDateRange } = useBilling();
  const [startDate, setStartDate] = useState(format(subMonths(new Date(), 11), 'yyyy-MM-dd'));
  const [endDate, setEndDate] = useState(format(new Date(), 'yyyy-MM-dd'));

  const selectedStartDate = new Date(startDate);
  const selectedEndDate = new Date(endDate);

  // Données pour le graphique des revenus mensuels
  const getMonthlyRevenue = () => {
    const months = eachMonthOfInterval({
      start: selectedStartDate,
      end: selectedEndDate
    });

    return months.map(month => {
      const monthStart = startOfMonth(month);
      const monthEnd = endOfMonth(month);
      const monthInvoices = getInvoicesByDateRange(monthStart, monthEnd)
        .filter(invoice => invoice.status === 'paid');
      
      const revenue = monthInvoices.reduce((sum, invoice) => sum + invoice.total, 0);
      
      return {
        month: format(month, 'MMM yyyy', { locale: fr }),
        revenue: revenue,
        invoices: monthInvoices.length
      };
    });
  };

  // Données pour le graphique des types de consultation
  const getConsultationTypes = () => {
    const typeCounts: { [key: string]: number } = {};
    
    invoices.forEach(invoice => {
      invoice.items.forEach(item => {
        const type = item.type === 'consultation' ? 'Consultation' : 
                    item.type === 'medication' ? 'Médicament' : 'Autre';
        typeCounts[type] = (typeCounts[type] || 0) + item.quantity;
      });
    });

    return Object.entries(typeCounts).map(([type, count]) => ({
      type,
      count,
      percentage: ((count / Object.values(typeCounts).reduce((a, b) => a + b, 0)) * 100).toFixed(1)
    }));
  };

  // Données pour le graphique des modes de paiement
  const getPaymentMethods = () => {
    const methodCounts: { [key: string]: number } = {};
    
    invoices.filter(invoice => invoice.status === 'paid').forEach(invoice => {
      const method = invoice.paymentMethod || 'Non spécifié';
      const label = method === 'cash' ? 'Espèces' :
                   method === 'orange_money' ? 'Orange Money' :
                   method === 'mtn_mobile_money' ? 'MTN Mobile Money' :
                   method === 'check' ? 'Chèque' :
                   method === 'transfer' ? 'Virement' : 'Non spécifié';
      methodCounts[label] = (methodCounts[label] || 0) + 1;
    });

    return Object.entries(methodCounts).map(([method, count]) => ({
      method,
      count
    }));
  };

  const monthlyData = getMonthlyRevenue();
  const consultationTypes = getConsultationTypes();
  const paymentMethods = getPaymentMethods();

  const totalRevenue = getTotalRevenue(selectedStartDate, selectedEndDate);
  const totalInvoices = getInvoicesByDateRange(selectedStartDate, selectedEndDate).length;
  const paidInvoices = getInvoicesByDateRange(selectedStartDate, selectedEndDate)
    .filter(invoice => invoice.status === 'paid').length;

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  return (
    <div className="space-y-6">
      {/* Filtres de date */}
      <Card>
        <CardHeader>
          <CardTitle>Période d'analyse</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="startDate">Date de début</Label>
              <Input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="endDate">Date de fin</Label>
              <Input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistiques générales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
            <CardTitle className="text-sm font-medium text-gray-600">Total Factures</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{totalInvoices}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Factures Payées</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{paidInvoices}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Taux de Paiement</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {totalInvoices > 0 ? Math.round((paidInvoices / totalInvoices) * 100) : 0}%
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Graphique des revenus mensuels */}
      <Card>
        <CardHeader>
          <CardTitle>Évolution des Revenus</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip 
                  formatter={(value: number) => [`${value.toLocaleString()} FCFA`, 'Revenus']}
                />
                <Bar dataKey="revenue" fill="#10B981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Graphiques en secteurs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Types de prestations */}
        <Card>
          <CardHeader>
            <CardTitle>Répartition des Prestations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={consultationTypes}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ type, percentage }) => `${type} (${percentage}%)`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {consultationTypes.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Modes de paiement */}
        <Card>
          <CardHeader>
            <CardTitle>Modes de Paiement</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={paymentMethods}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ method, count }) => `${method} (${count})`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {paymentMethods.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
