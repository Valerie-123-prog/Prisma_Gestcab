
import React from 'react';
import { Button } from "@/components/ui/button";
import { FileText, Upload, Plus } from 'lucide-react';

interface DocumentsHeaderProps {
  onNewDocument: () => void;
}

export const DocumentsHeader: React.FC<DocumentsHeaderProps> = ({ onNewDocument }) => {
  return (
    <div className="flex flex-col space-y-4 mb-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-indigo-600 rounded-xl flex items-center justify-center">
          <FileText className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 truncate">Gestion des Documents</h1>
          <p className="text-sm sm:text-base text-gray-600 truncate">Documents médicaux et résultats de laboratoire</p>
        </div>
      </div>
      
      <div className="flex justify-end gap-2">
        <Button 
          onClick={onNewDocument}
          className="bg-blue-600 hover:bg-blue-700 text-white shadow-md text-sm px-3 py-2 sm:px-4 sm:py-2"
        >
          <Plus className="h-4 w-4 mr-1 sm:mr-2" />
          <span className="hidden sm:inline">Nouveau Document</span>
          <span className="sm:hidden">Nouveau</span>
        </Button>
        <Button variant="outline" className="border-blue-200 text-blue-600 hover:bg-blue-50 text-sm px-3 py-2 sm:px-4 sm:py-2">
          <Upload className="h-4 w-4 mr-1 sm:mr-2" />
          <span className="hidden sm:inline">Importer</span>
          <span className="sm:hidden">Import</span>
        </Button>
      </div>
    </div>
  );
};
