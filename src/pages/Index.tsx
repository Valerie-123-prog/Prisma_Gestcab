
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Stethoscope } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center px-4">
      <Card className="w-full max-w-lg bg-white shadow-xl">
        <CardContent className="p-12 text-center">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center">
              <Stethoscope className="h-10 w-10 text-white" />
            </div>
          </div>
          
          {/* Titre */}
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Prisma GestCab
          </h1>
          
          {/* Description */}
          <p className="text-gray-600 mb-8 text-lg leading-relaxed">
            Logiciel de gestion de cabinet médical
          </p>
          
          {/* Boutons */}
          <div className="space-y-4">
            <Link to="/patients" className="block">
              <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 px-8 text-lg font-medium rounded-lg">
                Commencer
              </Button>
            </Link>
            <Link to="/login" className="block">
              <Button variant="outline" className="w-full py-3 px-8 text-lg font-medium rounded-lg">
                Se connecter
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;
