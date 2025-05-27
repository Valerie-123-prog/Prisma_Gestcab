
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Calendar, FileText, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
            Gestion Médicale
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Système complet de gestion des patients avec dossiers médicaux, 
            historique des consultations et suivi personnalisé.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/patients')}>
            <CardHeader className="text-center">
              <User className="h-12 w-12 text-blue-600 mx-auto mb-2" />
              <CardTitle>Patients</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-center">
                Gérer les informations des patients et leurs dossiers médicaux
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <Calendar className="h-12 w-12 text-green-600 mx-auto mb-2" />
              <CardTitle>Consultations</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-center">
                Programmer et suivre les consultations médicales
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <FileText className="h-12 w-12 text-purple-600 mx-auto mb-2" />
              <CardTitle>Dossiers</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-center">
                Consulter l'historique médical et les traitements
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <Search className="h-12 w-12 text-orange-600 mx-auto mb-2" />
              <CardTitle>Recherche</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-center">
                Rechercher rapidement patients et informations
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <Button 
            size="lg" 
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg"
            onClick={() => navigate('/patients')}
          >
            Accéder à la Gestion des Patients
          </Button>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-lg">
              <User className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Interface Intuitive</h3>
            <p className="text-gray-600">
              Interface simple et adaptée aux utilisateurs non-techniques
            </p>
          </div>
          
          <div className="text-center">
            <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Calendar className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Responsive Mobile</h3>
            <p className="text-gray-600">
              Optimisé pour tous les appareils, tablettes et smartphones
            </p>
          </div>
          
          <div className="text-center">
            <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-lg">
              <FileText className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Gestion Complète</h3>
            <p className="text-gray-600">
              Dossiers médicaux, consultations et suivi personnalisé
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
