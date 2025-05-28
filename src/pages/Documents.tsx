
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  FileText, 
  Upload, 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Trash2,
  Calendar,
  User,
  FileImage,
  FilePlus,
  Microscope,
  TestTube,
  Activity
} from 'lucide-react';

interface Document {
  id: string;
  name: string;
  type: 'medical' | 'lab' | 'image' | 'prescription' | 'report';
  category: string;
  patientName: string;
  date: Date;
  size: string;
  status: 'pending' | 'completed' | 'analyzed';
  labResults?: {
    testType: string;
    status: 'pending' | 'in-progress' | 'completed';
    priority: 'normal' | 'urgent';
  };
}

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

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'lab': return <TestTube className="h-4 w-4" />;
      case 'image': return <FileImage className="h-4 w-4" />;
      case 'medical': return <FileText className="h-4 w-4" />;
      case 'prescription': return <FilePlus className="h-4 w-4" />;
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

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.patientName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = selectedTab === 'all' || doc.type === selectedTab;
    return matchesSearch && matchesTab;
  });

  const labDocuments = documents.filter(doc => doc.type === 'lab');
  const pendingTests = labDocuments.filter(doc => doc.labResults?.status === 'pending' || doc.labResults?.status === 'in-progress');
  const urgentTests = labDocuments.filter(doc => doc.labResults?.priority === 'urgent');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <div className="container mx-auto px-4 py-6 lg:py-8">
        {/* En-tête */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div className="flex items-center gap-3 mb-4 lg:mb-0">
            <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Gestion des Documents</h1>
              <p className="text-gray-600">Documents médicaux et résultats de laboratoire</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button className="medical-button">
              <Upload className="h-4 w-4 mr-2" />
              Nouveau Document
            </Button>
          </div>
        </div>

        {/* Statistiques du laboratoire */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="medical-card">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Microscope className="h-5 w-5 text-indigo-600" />
                <CardTitle className="text-lg">Analyses en cours</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-indigo-600 mb-1">{pendingTests.length}</div>
              <p className="text-sm text-gray-600">Tests en attente de résultats</p>
            </CardContent>
          </Card>

          <Card className="medical-card">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-red-600" />
                <CardTitle className="text-lg">Tests urgents</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-600 mb-1">{urgentTests.length}</div>
              <p className="text-sm text-gray-600">Priorité élevée</p>
            </CardContent>
          </Card>

          <Card className="medical-card">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-green-600" />
                <CardTitle className="text-lg">Total documents</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600 mb-1">{documents.length}</div>
              <p className="text-sm text-gray-600">Documents archivés</p>
            </CardContent>
          </Card>
        </div>

        {/* Filtres et recherche */}
        <Card className="medical-card mb-6">
          <CardHeader>
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Rechercher par nom de document ou patient..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Button variant="outline" className="shrink-0">
                <Filter className="h-4 w-4 mr-2" />
                Filtres avancés
              </Button>
            </div>
          </CardHeader>
        </Card>

        {/* Liste des documents avec onglets */}
        <Card className="medical-card">
          <CardHeader>
            <CardTitle>Documents et Résultats</CardTitle>
            <CardDescription>
              Gérez tous vos documents médicaux et résultats de laboratoire
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={selectedTab} onValueChange={setSelectedTab}>
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="all">Tous</TabsTrigger>
                <TabsTrigger value="lab">Laboratoire</TabsTrigger>
                <TabsTrigger value="image">Imagerie</TabsTrigger>
                <TabsTrigger value="medical">Médicaux</TabsTrigger>
                <TabsTrigger value="prescription">Ordonnances</TabsTrigger>
              </TabsList>

              <TabsContent value={selectedTab} className="mt-6">
                <div className="space-y-4">
                  {filteredDocuments.map((doc) => (
                    <div key={doc.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 flex-1">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            {getTypeIcon(doc.type)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-medium text-gray-900">{doc.name}</h3>
                              {doc.labResults && (
                                <Badge className={getPriorityColor(doc.labResults.priority)}>
                                  {doc.labResults.priority === 'urgent' ? 'Urgent' : 'Normal'}
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <div className="flex items-center gap-1">
                                <User className="h-3 w-3" />
                                {doc.patientName}
                              </div>
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {doc.date.toLocaleDateString('fr-FR')}
                              </div>
                              <span>{doc.size}</span>
                              <span className="text-blue-600 font-medium">{doc.category}</span>
                            </div>
                            {doc.labResults && (
                              <div className="mt-2">
                                <Badge variant="outline" className="text-xs">
                                  {doc.labResults.testType} - {doc.labResults.status === 'completed' ? 'Terminé' : 
                                   doc.labResults.status === 'in-progress' ? 'En cours' : 'En attente'}
                                </Badge>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={getStatusColor(doc.status)}>
                            {doc.status === 'completed' ? 'Terminé' : 
                             doc.status === 'pending' ? 'En attente' : 'Analysé'}
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
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Documents;
