
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Calendar, Receipt, FileText, BarChart3, Plus } from "lucide-react";

const quickActions = [
  {
    title: "Nouveau Patient",
    href: "/patients",
    icon: Users,
    variant: "default" as const
  },
  {
    title: "Nouveau RDV",
    href: "/appointments",
    icon: Calendar,
    variant: "outline" as const
  },
  {
    title: "Nouvelle Facture",
    href: "/billing",
    icon: Receipt,
    variant: "outline" as const
  },
  {
    title: "Nouveau Document",
    href: "/documents",
    icon: FileText,
    variant: "outline" as const
  },
  {
    title: "Voir Rapports",
    href: "/reports",
    icon: BarChart3,
    variant: "outline" as const
  }
];

export const QuickActions = () => {
  return (
    <Card className="bg-white shadow-md hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="text-2xl text-center text-gray-900 mb-2">Actions Rapides</CardTitle>
        <CardDescription className="text-center text-gray-600">
          Accès direct aux fonctionnalités principales
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link key={action.title} to={action.href}>
                <Button 
                  variant={action.variant}
                  className={`w-full h-auto flex-col gap-2 py-4 transition-all duration-200 touch-target ${
                    action.variant === "default" 
                      ? "bg-blue-600 hover:bg-blue-700 text-white shadow-md" 
                      : "border-blue-200 text-blue-600 hover:bg-blue-50"
                  }`}
                >
                  {action.variant === "default" ? <Plus className="h-6 w-6" /> : <Icon className="h-6 w-6" />}
                  <span className="text-sm font-medium">{action.title}</span>
                </Button>
              </Link>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
