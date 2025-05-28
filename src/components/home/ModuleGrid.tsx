
import { Users, Calendar, Receipt, FileText, BarChart3 } from "lucide-react";
import { ModuleCard } from "./ModuleCard";

const modules = [
  {
    title: "Gestion des Patients",
    description: "Enregistrement, modification et suivi des dossiers patients",
    icon: Users,
    iconColor: "bg-blue-100 text-blue-600",
    href: "/patients",
    features: [
      "Informations personnelles",
      "Dossiers médicaux",
      "Historique des consultations"
    ]
  },
  {
    title: "Rendez-vous",
    description: "Planification et suivi des consultations",
    icon: Calendar,
    iconColor: "bg-green-100 text-green-600",
    href: "/appointments",
    features: [
      "Vue calendrier complète",
      "Prise de rendez-vous",
      "Gestion des créneaux"
    ]
  },
  {
    title: "Facturation",
    description: "Facturation et suivi des paiements",
    icon: Receipt,
    iconColor: "bg-purple-100 text-purple-600",
    href: "/billing",
    features: [
      "Création de factures",
      "Gestion des paiements",
      "Statistiques financières"
    ]
  },
  {
    title: "Documents",
    description: "Gestion des documents et laboratoire",
    icon: FileText,
    iconColor: "bg-indigo-100 text-indigo-600",
    href: "/documents",
    features: [
      "Documents médicaux",
      "Résultats de laboratoire",
      "Imagerie médicale"
    ]
  },
  {
    title: "Rapports",
    description: "Analyses et rapports détaillés",
    icon: BarChart3,
    iconColor: "bg-orange-100 text-orange-600",
    href: "/reports",
    features: [
      "Statistiques de consultation",
      "Rapports financiers",
      "Analyses de fréquentation"
    ]
  }
];

export const ModuleGrid = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-6 mb-12">
      {modules.map((module) => (
        <ModuleCard
          key={module.title}
          title={module.title}
          description={module.description}
          icon={module.icon}
          iconColor={module.iconColor}
          href={module.href}
          features={module.features}
        />
      ))}
    </div>
  );
};
