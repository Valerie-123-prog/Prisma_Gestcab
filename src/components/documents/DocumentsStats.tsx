
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Microscope, Activity, FileText } from 'lucide-react';
import { Document } from '@/types/document';

interface DocumentsStatsProps {
  documents: Document[];
}

export const DocumentsStats: React.FC<DocumentsStatsProps> = ({ documents }) => {
  const labDocuments = documents.filter(doc => doc.type === 'lab');
  const pendingTests = labDocuments.filter(doc => doc.labResults?.status === 'pending' || doc.labResults?.status === 'in-progress');
  const urgentTests = labDocuments.filter(doc => doc.labResults?.priority === 'urgent');

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 mb-6">
      <Card className="bg-white shadow-md hover:shadow-lg transition-shadow border-l-4 border-l-indigo-500">
        <CardHeader className="pb-2 sm:pb-3">
          <div className="flex items-center gap-2">
            <Microscope className="h-4 w-4 sm:h-5 sm:w-5 text-indigo-600" />
            <CardTitle className="text-base sm:text-lg">Analyses en cours</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl sm:text-3xl font-bold text-indigo-600 mb-1">{pendingTests.length}</div>
          <p className="text-xs sm:text-sm text-gray-600">Tests en attente de résultats</p>
        </CardContent>
      </Card>

      <Card className="bg-white shadow-md hover:shadow-lg transition-shadow border-l-4 border-l-red-500">
        <CardHeader className="pb-2 sm:pb-3">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 sm:h-5 sm:w-5 text-red-600" />
            <CardTitle className="text-base sm:text-lg">Tests urgents</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl sm:text-3xl font-bold text-red-600 mb-1">{urgentTests.length}</div>
          <p className="text-xs sm:text-sm text-gray-600">Priorité élevée</p>
        </CardContent>
      </Card>

      <Card className="bg-white shadow-md hover:shadow-lg transition-shadow border-l-4 border-l-green-500 sm:col-span-2 lg:col-span-1">
        <CardHeader className="pb-2 sm:pb-3">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
            <CardTitle className="text-base sm:text-lg">Total documents</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl sm:text-3xl font-bold text-green-600 mb-1">{documents.length}</div>
          <p className="text-xs sm:text-sm text-gray-600">Documents archivés</p>
        </CardContent>
      </Card>
    </div>
  );
};
