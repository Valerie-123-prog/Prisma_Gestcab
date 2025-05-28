
import { Activity } from "lucide-react";
import { GlobalSearch } from "@/components/common/GlobalSearch";

export const HeroSection = () => {
  return (
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
  );
};
