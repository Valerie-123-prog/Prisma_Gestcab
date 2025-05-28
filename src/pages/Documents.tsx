
import React, { useState } from 'react';
import { DocumentsHeader } from '@/components/documents/DocumentsHeader';
import { DocumentsStats } from '@/components/documents/DocumentsStats';
import { DocumentsFilters } from '@/components/documents/DocumentsFilters';
import { DocumentsList } from '@/components/documents/DocumentsList';
import { Document } from '@/types/document';

const mockDocuments: Document[] = [
  {
    id: '1',
    name: 'Analyse sanguine complète',
    type: 'lab',
    category: 'Hématologie',
    patientName: 'Jean Dupont',
    date: new Date('2024-01-15'),
    size: '2.3 MB',
    status: 'completed',
    labResults: {
      testType: 'Hémogramme',
      status: 'completed',
      priority: 'normal'
    }
  },
  {
    id: '2',
    name: 'Radiographie thoracique',
    type: 'image',
    category: 'Imagerie',
    patientName: 'Marie Martin',
    date: new Date('2024-01-14'),
    size: '15.7 MB',
    status: 'analyzed'
  },
  {
    id: '3',
    name: 'Rapport de consultation',
    type: 'medical',
    category: 'Consultation',
    patientName: 'Pierre Durand',
    date: new Date('2024-01-13'),
    size: '0.8 MB',
    status: 'completed'
  },
  {
    id: '4',
    name: 'Analyse urinaire',
    type: 'lab',
    category: 'Biochimie',
    patientName: 'Sophie Bernard',
    date: new Date('2024-01-12'),
    size: '1.2 MB',
    status: 'pending',
    labResults: {
      testType: 'ECBU',
      status: 'in-progress',
      priority: 'urgent'
    }
  }
];

const Documents = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTab, setSelectedTab] = useState('all');
  const [documents] = useState<Document[]>(mockDocuments);

  const handleNewDocument = () => {
    console.log('Nouveau document clicked');
    // Ici on pourrait ouvrir un modal ou naviguer vers une page de création
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <div className="container mx-auto px-2 sm:px-4 py-4 lg:py-8">
        <DocumentsHeader onNewDocument={handleNewDocument} />
        
        <DocumentsStats documents={documents} />
        
        <DocumentsFilters 
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />
        
        <DocumentsList 
          documents={documents}
          searchTerm={searchTerm}
          selectedTab={selectedTab}
          onTabChange={setSelectedTab}
        />
      </div>
    </div>
  );
};

export default Documents;
