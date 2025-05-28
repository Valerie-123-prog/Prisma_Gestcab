
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DocumentCard } from './DocumentCard';
import { Document } from '@/types/document';

interface DocumentsListProps {
  documents: Document[];
  searchTerm: string;
  selectedTab: string;
  onTabChange: (value: string) => void;
}

export const DocumentsList: React.FC<DocumentsListProps> = ({ 
  documents, 
  searchTerm, 
  selectedTab, 
  onTabChange 
}) => {
  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.patientName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = selectedTab === 'all' || doc.type === selectedTab;
    return matchesSearch && matchesTab;
  });

  return (
    <Card className="bg-white shadow-md">
      <CardHeader className="pb-3 sm:pb-4">
        <CardTitle className="text-lg sm:text-xl">Documents et Résultats</CardTitle>
        <CardDescription className="text-sm">
          Gérez tous vos documents médicaux et résultats de laboratoire
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={selectedTab} onValueChange={onTabChange}>
          <TabsList className="grid w-full grid-cols-3 sm:grid-cols-6 text-xs sm:text-sm">
            <TabsTrigger value="all">Tous</TabsTrigger>
            <TabsTrigger value="lab" className="hidden sm:block">Laboratoire</TabsTrigger>
            <TabsTrigger value="lab" className="sm:hidden">Lab</TabsTrigger>
            <TabsTrigger value="image">Imagerie</TabsTrigger>
            <TabsTrigger value="medical" className="hidden sm:block">Médicaux</TabsTrigger>
            <TabsTrigger value="medical" className="sm:hidden">Méd</TabsTrigger>
            <TabsTrigger value="prescription" className="hidden sm:block">Ordonnances</TabsTrigger>
            <TabsTrigger value="prescription" className="sm:hidden">Ord</TabsTrigger>
            <TabsTrigger value="administratifs" className="hidden sm:block">Administratifs</TabsTrigger>
            <TabsTrigger value="administratifs" className="sm:hidden">Admin</TabsTrigger>
          </TabsList>

          <TabsContent value={selectedTab} className="mt-4 sm:mt-6">
            <div className="space-y-3 sm:space-y-4">
              {filteredDocuments.map((doc) => (
                <DocumentCard key={doc.id} document={doc} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
