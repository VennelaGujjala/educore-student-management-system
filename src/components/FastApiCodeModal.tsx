import React, { useState, useEffect } from 'react';
import { FileCode, Copy, Check, Download, Layers, ShieldCheck, Terminal } from 'lucide-react';
import { fetchPythonPackage } from '../api';

export const FastApiCodeModal: React.FC = () => {
  const [files, setFiles] = useState<Record<string, string>>({});
  const [activeFile, setActiveFile] = useState<string>('main.py');
  const [loading, setLoading] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    fetchPythonPackage()
      .then((res) => {
        if (res.success && res.files) {
          setFiles(res.files);
          const firstKey = Object.keys(res.files)[0];
          if (firstKey) setActiveFile(firstKey);
        }
      })
      .catch((err) => {
        console.error('Failed to load python package:', err);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleCopy = () => {
    if (files[activeFile]) {
      navigator.clipboard.writeText(files[activeFile]);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownloadActiveFile = () => {
    if (!files[activeFile]) return;
    const blob = new Blob([files[activeFile]], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = activeFile;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 rounded-2xl p-6 text-white border border-slate-800 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <FileCode className="w-5 h-5 text-blue-400" />
              <h2 className="text-xl font-bold tracking-tight text-white">
                Python FastAPI + SQLite Production Architecture
              </h2>
            </div>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl">
              Complete standalone backend implementation using FastAPI, SQLAlchemy ORM, Pydantic v2 schemas, and SQLite database persistence. Ready to deploy or run locally.
            </p>
          </div>
          <div className="flex items-center space-x-2 text-xs text-slate-400 bg-slate-800/80 px-3 py-2 rounded-xl border border-slate-700">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>FastAPI 0.110+ • SQLite 3 • Pydantic v2</span>
          </div>
        </div>
      </div>

      {/* Code Viewer Panel */}
      <div className="bg-slate-950 rounded-2xl border border-slate-800 shadow-xl overflow-hidden">
        {/* File Tabs Header */}
        <div className="bg-slate-900 px-4 py-2.5 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center space-x-1 overflow-x-auto pb-1 sm:pb-0">
            {Object.keys(files).map((fileName) => (
              <button
                key={fileName}
                onClick={() => setActiveFile(fileName)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition flex items-center space-x-1.5 ${
                  activeFile === fileName
                    ? 'bg-slate-800 text-indigo-400 border border-slate-700 shadow-xs'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <FileCode className="w-3.5 h-3.5" />
                <span>{fileName}</span>
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleCopy}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
              title="Copy code to clipboard"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400 font-semibold">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy File</span>
                </>
              )}
            </button>

            <button
              onClick={handleDownloadActiveFile}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-indigo-600 hover:bg-indigo-500 text-white shadow-xs transition"
              title="Download file"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download</span>
            </button>
          </div>
        </div>

        {/* Code Content */}
        <div className="p-5 font-mono text-xs text-slate-200 overflow-x-auto max-h-[600px] leading-relaxed">
          {loading ? (
            <div className="py-12 text-center text-slate-500">
              <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
              <span>Loading source files...</span>
            </div>
          ) : (
            <pre className="whitespace-pre">{files[activeFile] || 'No content found'}</pre>
          )}
        </div>
      </div>
    </div>
  );
};
