
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Calendar, Receipt, BarChart3, Activity, FileText } from "lucide-react";
import { GlobalSearch } from "@/components/common/GlobalSearch";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <div className="container mx-auto px-4 py-6 lg:py-8">
        {/* En-tête */}
        <div className="text-center mb-8 lg:mb-12">
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center mb-4">
              <Activity className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Système de Gestion Médicale
          </h1>
          <p className="text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto mb-6 leading-relaxed">
            Une solution complète pour la gestion des patients, des rendez-vous, 
            de la facturation, des documents et des rapports médicaux
          </p>
          <div className="flex justify-center max-w-md mx-auto">
            <GlobalSearch />
          </div>
        </div>

        {/* Modules principaux */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-6 mb-12">
          <Link to="/patients" className="group">
            <Card className="medical-card h-full group-hover:scale-105 transition-transform duration-200">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                  <CardTitle className="text-lg text-gray-900">Gestion des Patients</CardTitle>
                </div>
                <CardDescription className="text-gray-600">
                  Enregistrement, modification et suivi des dossiers patients
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                    Informations personnelles
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                    Dossiers médicaux
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                    Historique des consultations
                  </li>
                </ul>
              </CardContent>
            </Card>
          </Link>

          <Link to="/appointments" className="group">
            <Card className="medical-card h-full group-hover:scale-105 transition-transform duration-200">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <Calendar className="h-6 w-6 text-green-600" />
                  </div>
                  <CardTitle className="text-lg text-gray-900">Rendez-vous</CardTitle>
                </div>
                <CardDescription className="text-gray-600">
                  Planification et suivi des consultations
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                    Vue calendrier complète
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                    Prise de rendez-vous
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                    Gestion des créneaux
                  </li>
                </ul>
              </CardContent>
            </Card>
          </Link>

          <Link to="/billing" className="group">
            <Card className="medical-card h-full group-hover:scale-105 transition-transform duration-200">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Receipt className="h-6 w-6 text-purple-600" />
                  </div>
                  <CardTitle className="text-lg text-gray-900">Facturation</CardTitle>
                </div>
                <CardDescription className="text-gray-600">
                  Facturation et suivi des paiements
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-purple-400 rounded-full"></div>
                    Création de factures
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-purple-400 rounded-full"></div>
                    Gestion des paiements
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-purple-400 rounded-full"></div>
                    Statistiques financières
                  </li>
                </ul>
              </CardContent>
            </Card>
          </Link>

          <Link to="/documents" className="group">
            <Card className="medical-card h-full group-hover:scale-105 transition-transform duration-200">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <FileText className="h-6 w-6 text-indigo-600" />
                  </div>
                  <CardTitle className="text-lg text-gray-900">Documents</CardTitle>
                </div>
                <CardDescription className="text-gray-600">
                  Gestion des documents et laboratoire
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full"></div>
                    Documents médicaux
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full"></div>
                    Résultats de laboratoire
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full"></div>
                    Imagerie médicale
                  </li>
                </ul>
              </CardContent>
            </Card>
          </Link>

          <Link to="/reports" className="group">
            <Card className="medical-card h-full group-hover:scale-105 transition-transform duration-200">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <BarChart3 className="h-6 w-6 text-orange-600" />
                  </div>
                  <CardTitle className="text-lg text-gray-900">Rapports</CardTitle>
                </div>
                <CardDescription className="text-gray-600">
                  Analyses et rapports détaillés
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-orange-400 rounded-full"></div>
                    Statistiques de consultation
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-orange-400 rounded-full"></div>
                    Rapports financiers
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-orange-400 rounded-full"></div>
                    Analyses de fréquentation
                  </li>
                </ul>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Actions rapides */}
        <Card className="medical-card">
          <CardHeader>
            <CardTitle className="text-2xl text-center text-gray-900 mb-2">Actions Rapides</CardTitle>
            <CardDescription className="text-center text-gray-600">
              Accès direct aux fonctionnalités principales
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              <Link to="/patients">
                <Button className="medical-button w-full h-auto flex-col gap-2 py-4">
                  <Users className="h-6 w-6" />
                  <span className="text-sm font-medium">Nouveau Patient</span>
                </Button>
              </Link>
              <Link to="/appointments">
                <Button variant="outline" className="w-full h-auto flex-col gap-2 py-4 touch-target border-blue-200 text-blue-600 hover:bg-blue-50">
                  <Calendar className="h-6 w-6" />
                  <span className="text-sm font-medium">Nouveau RDV</span>
                </Button>
              </Link>
              <Link to="/billing">
                <Button variant="outline" className="w-full h-auto flex-col gap-2 py-4 touch-target border-blue-200 text-blue-600 hover:bg-blue-50">
                  <Receipt className="h-6 w-6" />
                  <span className="text-sm font-medium">Nouvelle Facture</span>
                </Button>
              </Link>
              <Link to="/documents">
                <Button variant="outline" className="w-full h-auto flex-col gap-2 py-4 touch-target border-blue-200 text-blue-600 hover:bg-blue-50">
                  <FileText className="h-6 w-6" />
                  <span className="text-sm font-medium">Nouveau Document</span>
                </Button>
              </Link>
              <Link to="/reports">
                <Button variant="outline" className="w-full h-auto flex-col gap-2 py-4 touch-target border-blue-200 text-blue-600 hover:bg-blue-50">
                  <BarChart3 className="h-6 w-6" />
                  <span className="text-sm font-medium">Voir Rapports</span>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
