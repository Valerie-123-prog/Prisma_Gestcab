
import { Stethoscope } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export const HeroSection = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white rounded-2xl shadow-lg p-12 max-w-md w-full mx-4 text-center">
        <div className="flex items-center justify-center mb-8">
          <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center">
            <Stethoscope className="h-10 w-10 text-white" />
          </div>
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Prisma GestCab
        </h1>
        
        <p className="text-gray-600 mb-8">
          Logiciel de gestion de cabinet médical
        </p>
        
        <div className="space-y-4">
          <Link to="/patients" className="block">
            <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-medium">
              Commencer
            </Button>
          </Link>
          
          <Link to="/login" className="block">
            <Button variant="ghost" className="w-full text-gray-700 hover:text-gray-900">
              Se connecter
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
