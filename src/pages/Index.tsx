
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Calendar, FileText, Activity } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* En-tête */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Système de Gestion Médicale
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Une solution complète pour la gestion des patients, des rendez-vous et des dossiers médicaux
          </p>
        </div>

        {/* Modules principaux */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <Link to="/patients">
            <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-6 w-6 text-blue-600" />
                  Gestion des Patients
                </CardTitle>
                <CardDescription>
                  Enregistrement, modification et suivi des dossiers patients
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Informations personnelles</li>
                  <li>• Dossiers médicaux</li>
                  <li>• Historique des consultations</li>
                  <li>• Recherche et filtrage</li>
                </ul>
              </CardContent>
            </Card>
          </Link>

          <Link to="/appointments">
            <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-6 w-6 text-green-600" />
                  Gestion des Rendez-vous
                </CardTitle>
                <CardDescription>
                  Planification et suivi des consultations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Vue calendrier complète</li>
                  <li>• Prise de rendez-vous</li>
                  <li>• Gestion des créneaux</li>
                  <li>• Liste d'attente</li>
                </ul>
              </CardContent>
            </Card>
          </Link>

          <Card className="h-full opacity-75">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-6 w-6 text-purple-600" />
                Rapports et Statistiques
              </CardTitle>
              <CardDescription>
                Analyses et rapports détaillés (bientôt disponible)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Statistiques de consultation</li>
                <li>• Rapports financiers</li>
                <li>• Analyses de fréquentation</li>
                <li>• Exportation de données</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Actions rapides */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-6 text-center">Actions Rapides</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link to="/patients">
              <Button className="w-full h-16 text-lg">
                <Users className="mr-2 h-5 w-5" />
                Nouveau Patient
              </Button>
            </Link>
            <Link to="/appointments">
              <Button variant="outline" className="w-full h-16 text-lg">
                <Calendar className="mr-2 h-5 w-5" />
                Nouveau Rendez-vous
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
