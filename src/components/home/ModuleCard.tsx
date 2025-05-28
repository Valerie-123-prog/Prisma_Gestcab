
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface ModuleCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  iconColor: string;
  href: string;
  features: string[];
}

export const ModuleCard = ({ title, description, icon: Icon, iconColor, href, features }: ModuleCardProps) => {
  return (
    <Link to={href} className="group">
      <Card className="medical-card h-full group-hover:scale-105 transition-transform duration-200">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3 mb-2">
            <div className={`w-12 h-12 ${iconColor} rounded-lg flex items-center justify-center`}>
              <Icon className="h-6 w-6" />
            </div>
            <CardTitle className="text-lg text-gray-900">{title}</CardTitle>
          </div>
          <CardDescription className="text-gray-600">
            {description}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <ul className="space-y-2 text-sm text-gray-600">
            {features.map((feature, index) => (
              <li key={index} className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                {feature}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </Link>
  );
};
