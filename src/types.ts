export interface StudentRecord {
  id: string;
  name: string;
  dob: string; // YYYY-MM-DD
  email: string;
  phone: string;
  course: string;
  address: string;
  enrollment_date: string; // YYYY-MM-DD
  status: 'Active' | 'On Leave' | 'Graduated' | 'Suspended';
  gpa: number;
  emergency_contact?: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

export interface StudentFormData {
  id?: string;
  name: string;
  dob: string;
  email: string;
  phone: string;
  course: string;
  address: string;
  enrollment_date: string;
  status: 'Active' | 'On Leave' | 'Graduated' | 'Suspended';
  gpa: number;
  emergency_contact?: string;
  notes?: string;
}

export interface AiQueryResponse {
  success: boolean;
  provider: string;
  answer: string;
  matchedIds: string[];
  reasoning?: string;
  detail?: string;
}

export interface PythonPackageResponse {
  success: boolean;
  files: Record<string, string>;
}
