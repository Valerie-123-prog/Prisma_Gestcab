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
  Activity,
  Plus
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

  const handleNewDocument = () => {
    console.log('Nouveau document clicked');
    // Ici on pourrait ouvrir un modal ou naviguer vers une page de création
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <div className="container mx-auto px-2 sm:px-4 py-4 lg:py-8">
        {/* En-tête optimisé mobile */}
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
          
          {/* Boutons d'action - alignés à droite */}
          <div className="flex justify-end gap-2">
            <Button 
              onClick={handleNewDocument}
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

        {/* Statistiques du laboratoire - responsive grid */}
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

        {/* Filtres et recherche - optimisé mobile */}
        <Card className="bg-white shadow-md mb-4 sm:mb-6">
          <CardHeader className="pb-3 sm:pb-4">
            <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0 sm:gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Rechercher..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 text-sm"
                  />
                </div>
              </div>
              <Button variant="outline" className="shrink-0 border-blue-200 text-blue-600 hover:bg-blue-50 text-sm">
                <Filter className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Filtres avancés</span>
                <span className="sm:hidden">Filtres</span>
              </Button>
            </div>
          </CardHeader>
        </Card>

        {/* Liste des documents avec onglets - optimisé mobile */}
        <Card className="bg-white shadow-md">
          <CardHeader className="pb-3 sm:pb-4">
            <CardTitle className="text-lg sm:text-xl">Documents et Résultats</CardTitle>
            <CardDescription className="text-sm">
              Gérez tous vos documents médicaux et résultats de laboratoire
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={selectedTab} onValueChange={setSelectedTab}>
              <TabsList className="grid w-full grid-cols-3 sm:grid-cols-5 text-xs sm:text-sm">
                <TabsTrigger value="all">Tous</TabsTrigger>
                <TabsTrigger value="lab" className="hidden sm:block">Laboratoire</TabsTrigger>
                <TabsTrigger value="lab" className="sm:hidden">Lab</TabsTrigger>
                <TabsTrigger value="image">Imagerie</TabsTrigger>
                <TabsTrigger value="medical" className="hidden sm:block">Médicaux</TabsTrigger>
                <TabsTrigger value="medical" className="sm:hidden">Méd</TabsTrigger>
                <TabsTrigger value="prescription" className="hidden sm:block">Ordonnances</TabsTrigger>
                <TabsTrigger value="prescription" className="sm:hidden">Ord</TabsTrigger>
              </TabsList>

              <TabsContent value={selectedTab} className="mt-4 sm:mt-6">
                <div className="space-y-3 sm:space-y-4">
                  {filteredDocuments.map((doc) => (
                    <div key={doc.id} className="border border-gray-200 rounded-lg p-3 sm:p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                        <div className="flex items-start gap-3 flex-1 min-w-0">
                          <div className="p-2 bg-blue-100 rounded-lg shrink-0">
                            {getTypeIcon(doc.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-2">
                              <h3 className="font-medium text-gray-900 text-sm sm:text-base truncate">{doc.name}</h3>
                              {doc.labResults && (
                                <Badge className={`${getPriorityColor(doc.labResults.priority)} text-xs shrink-0`}>
                                  {doc.labResults.priority === 'urgent' ? 'Urgent' : 'Normal'}
                                </Badge>
                              )}
                            </div>
                            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-xs sm:text-sm text-gray-600">
                              <div className="flex items-center gap-1">
                                <User className="h-3 w-3" />
                                <span className="truncate">{doc.patientName}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                <span>{doc.date.toLocaleDateString('fr-FR')}</span>
                              </div>
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
                        <div className="flex items-center justify-between sm:justify-end gap-2">
                          <Badge className={`${getStatusColor(doc.status)} text-xs`}>
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
