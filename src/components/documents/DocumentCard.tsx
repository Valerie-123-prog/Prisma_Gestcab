import React from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Eye, 
  Download, 
  Trash2,
  Calendar,
  User,
  FileText,
  FileImage,
  FilePlus,
  TestTube,
  Folder
} from 'lucide-react';
import { Document } from '@/types/document';

interface DocumentCardProps {
  document: Document;
}

export const DocumentCard: React.FC<DocumentCardProps> = ({ document }) => {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'lab': return <TestTube className="h-4 w-4" />;
      case 'image': return <FileImage className="h-4 w-4" />;
      case 'medical': return <FileText className="h-4 w-4" />;
      case 'prescription': return <FilePlus className="h-4 w-4" />;
      case 'administratifs': return <Folder className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'analyzed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'normal': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="border border-gray-200 rounded-lg p-3 sm:p-4 hover:bg-gray-50 transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div className="p-2 bg-blue-100 rounded-lg shrink-0">
            {getTypeIcon(document.type)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-2">
              <h3 className="font-medium text-gray-900 text-sm sm:text-base truncate">{document.name}</h3>
              {document.labResults && (
                <Badge className={`${getPriorityColor(document.labResults.priority)} text-xs shrink-0`}>
                  {document.labResults.priority === 'urgent' ? 'Urgent' : 'Normal'}
                </Badge>
              )}
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-xs sm:text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <User className="h-3 w-3" />
                <span className="truncate">{document.patientName}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>{document.date.toLocaleDateString('fr-FR')}</span>
              </div>
              <span className="text-blue-600 font-medium">{document.category}</span>
            </div>
            {document.labResults && (
              <div className="mt-2">
                <Badge variant="outline" className="text-xs">
                  {document.labResults.testType} - {document.labResults.status === 'completed' ? 'Terminé' : 
                   document.labResults.status === 'in-progress' ? 'En cours' : 'En attente'}
                </Badge>
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center justify-between sm:justify-end gap-2">
          <Badge className={`${getStatusColor(document.status)} text-xs`}>
            {document.status === 'completed' ? 'Terminé' : 
             document.status === 'pending' ? 'En attente' : 'Analysé'}
          </Badge>
          <div className="flex gap-1">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Eye className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Download className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
