
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ActivityReports } from '@/components/reports/ActivityReports';
import { GlobalSearch } from '@/components/common/GlobalSearch';
import { BarChart3, FileText, TrendingUp } from 'lucide-react';

const Reports = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Rapports et Analyses</h1>
          </div>
          <GlobalSearch />
        </div>

        {/* Navigation Tabs */}
        <Tabs defaultValue="activity" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="activity" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Activité
            </TabsTrigger>
            <TabsTrigger value="patients" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Patients
            </TabsTrigger>
            <TabsTrigger value="financial" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Financier
            </TabsTrigger>
          </TabsList>

          <TabsContent value="activity">
            <ActivityReports />
          </TabsContent>

          <TabsContent value="patients">
            <Card>
              <CardHeader>
                <CardTitle>Rapports Patients</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-gray-500">
                  <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Rapports patients détaillés</p>
                  <p className="text-sm">Fonctionnalité en développement</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="financial">
            <Card>
              <CardHeader>
                <CardTitle>Analyses Financières</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-gray-500">
                  <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Analyses financières avancées</p>
                  <p className="text-sm">Fonctionnalité en développement</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Reports;
