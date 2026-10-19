import React, { useState } from 'react';
import { Terminal, Play, Copy, Check, ExternalLink, Code2, Layers, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { StudentRecord } from '../types';

interface ApiExplorerProps {
  students: StudentRecord[];
  onRefreshData: () => void;
}

interface EndpointDef {
  id: string;
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  path: string;
  summary: string;
  description: string;
  defaultParams?: Record<string, string>;
  defaultBody?: string;
}

const ENDPOINTS: EndpointDef[] = [
  {
    id: 'get-all',
    method: 'GET',
    path: '/api/students',
    summary: 'List & Filter Students',
    description: 'Retrieve all student records with optional search query, course filter, and birth date range filter.',
    defaultParams: { q: '', course: '', born_after: '2005-01-01' }
  },
  {
    id: 'get-one',
    method: 'GET',
    path: '/api/students/{student_id}',
    summary: 'View Student Profile',
    description: 'Fetch complete student record details by unique institutional Student ID.',
    defaultParams: { student_id: 'STU-2024-002' }
  },
  {
    id: 'create-student',
    method: 'POST',
    path: '/api/students',
    summary: 'Create Student Record',
    description: 'Add a new student record to the database with schema validation and duplicate checking.',
    defaultBody: JSON.stringify(
      {
        id: 'STU-2025-099',
        name: 'Jordan Lee',
        dob: '2006-11-20',
        email: 'jordan.lee@edumail.org',
        phone: '+1 (555) 777-8899',
        course: 'Data Science & Artificial Intelligence',
        address: '450 Silicon Avenue, San Jose, CA',
        enrollment_date: '2025-01-10',
        status: 'Active',
        gpa: 3.88
      },
      null,
      2
    )
  },
  {
    id: 'update-student',
    method: 'PUT',
    path: '/api/students/{student_id}',
    summary: 'Update Student Details',
    description: 'Modify details of an existing student record in the persistent storage.',
    defaultParams: { student_id: 'STU-2024-001' },
    defaultBody: JSON.stringify(
      {
        gpa: 3.92,
        status: 'Active',
        notes: 'Promoted to Lead Department Researcher'
      },
      null,
      2
    )
  },
  {
    id: 'delete-student',
    method: 'DELETE',
    path: '/api/students/{student_id}',
    summary: 'Delete Student Record',
    description: 'Permanently remove a student record from the database by student ID.',
    defaultParams: { student_id: 'STU-2024-008' }
  },
  {
    id: 'ai-query',
    method: 'POST',
    path: '/api/ai/query',
    summary: 'Grounded AI Query Extension',
    description: 'Ask natural-language questions grounded strictly in persistent SQLite student records without unrestricted SQL execution.',
    defaultBody: JSON.stringify(
      {
        question: 'List students born after 2005'
      },
      null,
      2
    )
  }
];

export const ApiExplorer: React.FC<ApiExplorerProps> = ({ students, onRefreshData }) => {
  const [selectedEndpoint, setSelectedEndpoint] = useState<EndpointDef>(ENDPOINTS[0]);
  const [params, setParams] = useState<Record<string, string>>(ENDPOINTS[0].defaultParams || {});
  const [bodyText, setBodyText] = useState<string>(ENDPOINTS[0].defaultBody || '');
  const [loading, setLoading] = useState(false);
  const [responseStatus, setResponseStatus] = useState<number | null>(null);
  const [responseData, setResponseData] = useState<unknown>(null);
  const [executionTime, setExecutionTime] = useState<number | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [codeLang, setCodeLang] = useState<'curl' | 'python' | 'javascript'>('python');

  const handleSelectEndpoint = (ep: EndpointDef) => {
    setSelectedEndpoint(ep);
    // Auto-substitute a real ID from students if available
    const initialParams = { ...(ep.defaultParams || {}) };
    if (initialParams.student_id && students.length > 0) {
      initialParams.student_id = students[0].id;
    }
    setParams(initialParams);
    setBodyText(ep.defaultBody || '');
    setResponseStatus(null);
    setResponseData(null);
    setExecutionTime(null);
  };

  const executeRequest = async () => {
    setLoading(true);
    const startTime = performance.now();

    try {
      let resolvedPath = selectedEndpoint.path;
      if (params.student_id) {
        resolvedPath = resolvedPath.replace('{student_id}', encodeURIComponent(params.student_id));
      }

      const queryParams = new URLSearchParams();
      Object.entries(params).forEach(([k, v]) => {
        if (k !== 'student_id' && v) {
          queryParams.append(k, v);
        }
      });
      if (queryParams.toString()) {
        resolvedPath += `?${queryParams.toString()}`;
      }

      const options: RequestInit = {
        method: selectedEndpoint.method,
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        }
      };

      if (['POST', 'PUT', 'PATCH'].includes(selectedEndpoint.method) && bodyText) {
        options.body = bodyText;
      }

      const res = await fetch(resolvedPath, options);
      const json = await res.json().catch(() => ({ status: res.statusText }));
      const duration = Math.round(performance.now() - startTime);

      setResponseStatus(res.status);
      setResponseData(json);
      setExecutionTime(duration);

      // If mutation, refresh student list in background
      if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(selectedEndpoint.method) && res.ok) {
        onRefreshData();
      }
    } catch (err: unknown) {
      setResponseStatus(500);
      setResponseData({ error: (err as Error)?.message || 'Network Error' });
      setExecutionTime(Math.round(performance.now() - startTime));
    } finally {
      setLoading(false);
    }
  };

  const getCodeSnippet = () => {
    let resolvedPath = selectedEndpoint.path;
    if (params.student_id) {
      resolvedPath = resolvedPath.replace('{student_id}', params.student_id);
    }
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (k !== 'student_id' && v) queryParams.append(k, v);
    });
    if (queryParams.toString()) resolvedPath += `?${queryParams.toString()}`;

    const host = window.location.origin;
    const fullUrl = `${host}${resolvedPath}`;

    if (codeLang === 'curl') {
      if (['POST', 'PUT', 'PATCH'].includes(selectedEndpoint.method) && bodyText) {
        return `curl -X ${selectedEndpoint.method} "${fullUrl}" \\
  -H "Content-Type: application/json" \\
  -d '${bodyText.replace(/\n/g, '')}'`;
      }
      return `curl -X ${selectedEndpoint.method} "${fullUrl}"`;
    }

    if (codeLang === 'python') {
      if (['POST', 'PUT', 'PATCH'].includes(selectedEndpoint.method) && bodyText) {
        return `import requests

url = "${fullUrl}"
payload = ${bodyText}

response = requests.${selectedEndpoint.method.toLowerCase()}(url, json=payload)
print(response.status_code)
print(response.json())`;
      }
      return `import requests

url = "${fullUrl}"
response = requests.${selectedEndpoint.method.toLowerCase()}(url)
print(response.status_code)
print(response.json())`;
    }

    // JavaScript
    return `const res = await fetch("${fullUrl}", {
  method: "${selectedEndpoint.method}",
  headers: { "Content-Type": "application/json" }${
    ['POST', 'PUT', 'PATCH'].includes(selectedEndpoint.method) && bodyText
      ? `,\n  body: JSON.stringify(${bodyText})`
      : ''
  }
});
const data = await res.json();
console.log(data);`;
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(getCodeSnippet());
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const getMethodColor = (m: EndpointDef['method']) => {
    switch (m) {
      case 'GET':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'POST':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'PUT':
      case 'PATCH':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'DELETE':
        return 'bg-rose-50 text-rose-700 border-rose-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 rounded-2xl p-6 text-white border border-slate-800 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <Terminal className="w-5 h-5 text-emerald-400" />
              <h2 className="text-xl font-bold tracking-tight text-white">
                FastAPI Interactive REST API Explorer
              </h2>
            </div>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl">
              Live documentation and interactive testing sandbox conforming to OpenAPI 3.0 / FastAPI standards. Execute real HTTP requests against the persistent database.
            </p>
          </div>
          <div className="flex items-center space-x-2 text-xs text-slate-400 bg-slate-800/80 px-3 py-2 rounded-xl border border-slate-700">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>SQLite Schema Verified & Persisted</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left column: Endpoints list */}
        <div className="lg:col-span-4 space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
            Suggested Endpoints (Section 04 Spec)
          </h3>
          <div className="space-y-1.5">
            {ENDPOINTS.map((ep) => {
              const isSelected = selectedEndpoint.id === ep.id;
              return (
                <button
                  key={ep.id}
                  onClick={() => handleSelectEndpoint(ep)}
                  className={`w-full text-left p-3 rounded-xl border transition flex items-center justify-between ${
                    isSelected
                      ? 'bg-indigo-50/80 border-indigo-300 shadow-xs'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center space-x-2.5 truncate">
                    <span
                      className={`text-xs font-mono font-bold px-2 py-0.5 rounded border ${getMethodColor(
                        ep.method
                      )}`}
                    >
                      {ep.method}
                    </span>
                    <div className="truncate">
                      <div className="text-xs font-mono font-semibold text-slate-800 truncate">
                        {ep.path}
                      </div>
                      <div className="text-[11px] text-slate-500 truncate">{ep.summary}</div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right column: Interactive Console */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <span
                  className={`text-xs font-mono font-bold px-2.5 py-1 rounded border ${getMethodColor(
                    selectedEndpoint.method
                  )}`}
                >
                  {selectedEndpoint.method}
                </span>
                <span className="font-mono text-sm font-bold text-slate-900">
                  {selectedEndpoint.path}
                </span>
              </div>
              <button
                onClick={executeRequest}
                disabled={loading}
                className="inline-flex items-center space-x-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-emerald-600/20 transition disabled:opacity-50 self-start sm:self-auto"
              >
                {loading ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Executing...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Execute Request</span>
                  </>
                )}
              </button>
            </div>

            <p className="text-xs text-slate-600">{selectedEndpoint.description}</p>

            {/* Parameters if any */}
            {selectedEndpoint.defaultParams && (
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                  Parameters
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {Object.entries(params).map(([k, v]) => (
                    <div key={k} className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                      <span className="text-[11px] font-mono text-slate-500 block mb-1">
                        {k}:
                      </span>
                      <input
                        type="text"
                        value={v}
                        onChange={(e) => setParams({ ...params, [k]: e.target.value })}
                        className="w-full px-2.5 py-1 text-xs font-mono bg-white border border-slate-300 rounded focus:ring-1 focus:ring-indigo-500 focus:outline-hidden"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Request Body if POST/PUT */}
            {['POST', 'PUT', 'PATCH'].includes(selectedEndpoint.method) && (
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                  Request Body (application/json)
                </label>
                <textarea
                  rows={6}
                  value={bodyText}
                  onChange={(e) => setBodyText(e.target.value)}
                  className="w-full p-3 font-mono text-xs bg-slate-900 text-slate-100 rounded-xl border border-slate-700 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            )}

            {/* Response Area */}
            {responseStatus !== null && (
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-slate-700">Response Status:</span>
                    <span
                      className={`font-mono font-bold px-2 py-0.5 rounded ${
                        responseStatus >= 200 && responseStatus < 300
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {responseStatus}
                    </span>
                  </div>
                  {executionTime !== null && (
                    <span className="text-slate-400 font-mono">Time: {executionTime}ms</span>
                  )}
                </div>

                <div className="bg-slate-900 text-slate-100 p-4 rounded-xl font-mono text-xs overflow-x-auto max-h-72 border border-slate-800">
                  <pre>{JSON.stringify(responseData, null, 2)}</pre>
                </div>
              </div>
            )}

            {/* Code Generation Snippet */}
            <div className="pt-3 border-t border-slate-100 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Code2 className="w-4 h-4 text-indigo-600" />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
                    Client Code Snippet
                  </span>
                </div>
                <div className="flex items-center space-x-1.5">
                  {(['python', 'curl', 'javascript'] as const).map((lang) => (
                    <button
                      key={lang}
                      onClick={() => setCodeLang(lang)}
                      className={`px-2 py-0.5 text-[11px] rounded font-medium transition ${
                        codeLang === lang
                          ? 'bg-slate-800 text-white'
                          : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
                      }`}
                    >
                      {lang.toUpperCase()}
                    </button>
                  ))}
                  <button
                    onClick={handleCopyCode}
                    className="p-1 text-slate-400 hover:text-indigo-600 ml-1 rounded transition"
                    title="Copy Snippet"
                  >
                    {copiedCode ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>

              <div className="bg-slate-950 text-slate-200 p-3 rounded-xl font-mono text-xs overflow-x-auto border border-slate-800">
                <pre>{getCodeSnippet()}</pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
