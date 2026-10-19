import { StudentRecord, StudentFormData, AiQueryResponse, PythonPackageResponse } from './types';

export async function fetchStudents(params?: {
  q?: string;
  course?: string;
  status?: string;
  born_after?: string;
  born_before?: string;
  sort_by?: string;
  order?: 'asc' | 'desc';
}): Promise<{ count: number; data: StudentRecord[] }> {
  const query = new URLSearchParams();
  if (params?.q) query.append('q', params.q);
  if (params?.course && params.course !== 'All') query.append('course', params.course);
  if (params?.status && params.status !== 'All') query.append('status', params.status);
  if (params?.born_after) query.append('born_after', params.born_after);
  if (params?.born_before) query.append('born_before', params.born_before);
  if (params?.sort_by) query.append('sort_by', params.sort_by);
  if (params?.order) query.append('order', params.order);

  const url = `/api/students${query.toString() ? '?' + query.toString() : ''}`;
  const res = await fetch(url);
  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.detail || 'Failed to fetch students');
  }
  return json;
}

export async function fetchStudentById(id: string): Promise<StudentRecord> {
  const res = await fetch(`/api/students/${encodeURIComponent(id)}`);
  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.detail || `Failed to fetch student ${id}`);
  }
  return json.data;
}

export async function createStudent(data: StudentFormData): Promise<StudentRecord> {
  const res = await fetch('/api/students', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.detail || 'Failed to create student record');
  }
  return json.data;
}

export async function updateStudent(id: string, data: Partial<StudentFormData>): Promise<StudentRecord> {
  const res = await fetch(`/api/students/${encodeURIComponent(id)}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.detail || `Failed to update student ${id}`);
  }
  return json.data;
}

export async function deleteStudent(id: string): Promise<void> {
  const res = await fetch(`/api/students/${encodeURIComponent(id)}`, {
    method: 'DELETE',
  });
  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.detail || `Failed to delete student ${id}`);
  }
}

export async function resetDatabase(): Promise<StudentRecord[]> {
  const res = await fetch('/api/students/reset', {
    method: 'POST',
  });
  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.detail || 'Failed to reset database');
  }
  return json.data;
}

export async function queryNaturalLanguage(question: string): Promise<AiQueryResponse> {
  const res = await fetch('/api/ai/query', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question }),
  });
  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.detail || 'Failed to execute natural language query');
  }
  return json;
}

export async function fetchPythonPackage(): Promise<PythonPackageResponse> {
  const res = await fetch('/api/python-package');
  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.detail || 'Failed to fetch python codebase');
  }
  return json;
}
