
export interface Document {
  id: string;
  title: string;
  type: 'ordonnance' | 'certificat' | 'rapport' | 'administratifs' | 'analyse' | 'actes_medicaux';
  content: string;
  patientId: string;
  patientName: string;
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
  isArchived: boolean;
}

export interface DocumentFormData {
  title: string;
  type: Document['type'];
  content: string;
  patientId: string;
  tags: string[];
}

export interface DocumentFilters {
  type?: Document['type'];
  patientId?: string;
  isArchived?: boolean;
  dateFrom?: Date;
  dateTo?: Date;
  searchQuery?: string;
}

export const DOCUMENT_TYPES = {
  ordonnance: 'Ordonnance',
  certificat: 'Certificat médical',
  rapport: 'Rapport de consultation',
  administratifs: 'Documents administratifs',
  analyse: 'Analyse',
  actes_medicaux: 'Actes médicaux'
} as const;
