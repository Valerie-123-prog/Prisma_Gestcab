
export interface Document {
  id: string;
  name: string;
  type: 'medical' | 'lab' | 'image' | 'prescription' | 'report';
  category: string;
  patientName: string;
  date: Date;
  size: string;
  status: 'pending' | 'completed' | 'analyzed';
  labResults?: {
    testType: string;
    status: 'pending' | 'in-progress' | 'completed';
    priority: 'normal' | 'urgent';
  };
}
