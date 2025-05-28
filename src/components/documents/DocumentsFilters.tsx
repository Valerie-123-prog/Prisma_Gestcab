
import React from 'react';
import { Card, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter } from 'lucide-react';

interface DocumentsFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export const DocumentsFilters: React.FC<DocumentsFiltersProps> = ({ 
  searchTerm, 
  onSearchChange 
}) => {
  return (
    <Card className="bg-white shadow-md mb-4 sm:mb-6">
      <CardHeader className="pb-3 sm:pb-4">
        <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0 sm:gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
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
  );
};
