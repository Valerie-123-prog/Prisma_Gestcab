export interface LabResults {
  testType: string;
  status: 'pending' | 'in-progress' | 'completed';
  priority: 'normal' | 'urgent';
}

export interface Document {
  id: string;
  name: string;
  type: 'medical' | 'lab' | 'image' | 'prescription' | 'administratifs' | 'report';
  category: string;
  patientName: string;
  date: Date;
  size: string;
  status: 'pending' | 'completed' | 'analyzed';
  labResults?: LabResults;
}

export const DOCUMENT_TYPE_LABELS: Record<Document['type'], string> = {
  medical: 'Médical',
  lab: 'Laboratoire',
  image: 'Imagerie',
  prescription: 'Ordonnance',
  administratifs: 'Documents administratifs',
  report: 'Rapport',
};
