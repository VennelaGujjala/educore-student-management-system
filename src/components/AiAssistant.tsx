import React, { useState } from 'react';
import { Sparkles, Send, ShieldCheck, Database, HelpCircle, ArrowRight, UserCheck, Calendar, BookOpen } from 'lucide-react';
import { StudentRecord, AiQueryResponse } from '../types';
import { queryNaturalLanguage } from '../api';

interface AiAssistantProps {
  students: StudentRecord[];
  onSelectStudent: (student: StudentRecord) => void;
}

interface QueryHistoryItem {
  id: string;
  question: string;
  response: AiQueryResponse;
  timestamp: string;
}

const PRESET_QUERIES = [
  'How many students are there?',
  'List students born after 2005',
  'Who is enrolled in Data Science & Artificial Intelligence?',
  'Who is the youngest student in the database?',
  'What is the highest GPA in the database?',
  'Which students are currently On Leave?'
];

export const AiAssistant: React.FC<AiAssistantProps> = ({ students, onSelectStudent }) => {
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<QueryHistoryItem[]>([
    {
      id: 'initial-1',
      question: 'List students born after 2005',
      response: {
        success: true,
        provider: 'Grounded Query Engine',
        answer: 'Found 3 students born after 2005: Elena Rostova (DOB: 2006-05-22, Data Science & AI), Priya Patel (DOB: 2006-08-30, Cloud Computing & DevOps), and Mateo Hernandez (DOB: 2007-01-19, Data Science & AI).',
        matchedIds: ['STU-2024-002', 'STU-2024-004', 'STU-2024-007'],
        reasoning: 'Filtered database records where birth year is strictly greater than 2005.'
      },
      timestamp: 'Sample Demonstration'
    }
  ]);

  const handleQuery = async (queryText: string) => {
    const q = queryText.trim();
    if (!q) return;

    setLoading(true);
    try {
      const result = await queryNaturalLanguage(q);
      const newItem: QueryHistoryItem = {
        id: Date.now().toString(),
        question: q,
        response: result,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setHistory(prev => [newItem, ...prev]);
      setQuestion('');
    } catch (err: unknown) {
      const errItem: QueryHistoryItem = {
        id: Date.now().toString(),
        question: q,
        response: {
          success: false,
          provider: 'Error',
          answer: (err as Error)?.message || 'Failed to process natural language query.',
          matchedIds: [],
          reasoning: 'Query execution error'
        },
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setHistory(prev => [errItem, ...prev]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleQuery(question);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-6 text-white border border-slate-800 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start space-x-3">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-300 shrink-0">
              <Sparkles className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-xl font-bold tracking-tight text-white">
                  Natural Language Record Assistant
                </h2>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold">
                  Grounded Engine Active
                </span>
              </div>
              <p className="text-sm text-slate-300 mt-1 max-w-2xl">
                Ask questions about students in natural language. The backend retrieves the relevant records from the SQLite database and synthesizes accurate, human-readable answers strictly grounded in the database context.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 text-xs text-slate-400 bg-white/5 px-3 py-2 rounded-xl border border-white/10 shrink-0">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Read-only Safe Execution (No Unrestricted SQL)</span>
          </div>
        </div>

        {/* Preset Query Chips */}
        <div className="mt-6 pt-4 border-t border-slate-800">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center space-x-1">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Suggested Inquiries (Click to execute)</span>
          </p>
          <div className="flex flex-wrap gap-2">
            {PRESET_QUERIES.map((preset) => (
              <button
                key={preset}
                onClick={() => handleQuery(preset)}
                disabled={loading}
                className="text-xs px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-indigo-600 hover:text-white text-slate-300 border border-slate-700/80 transition flex items-center space-x-1.5 disabled:opacity-50"
              >
                <span>{preset}</span>
                <ArrowRight className="w-3 h-3 opacity-60" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Input Box */}
      <form onSubmit={handleSubmit} className="relative">
        <div className="flex items-center bg-white rounded-2xl border-2 border-indigo-100 shadow-sm focus-within:border-indigo-600 transition p-2">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask a question (e.g., 'How many students are there?' or 'List students born after 2005')..."
            className="w-full px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !question.trim()}
            className="inline-flex items-center space-x-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold text-sm transition shadow-md shadow-indigo-600/30 disabled:opacity-50 shrink-0"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Synthesizing...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Submit Query</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Results History */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 flex items-center space-x-2">
          <Database className="w-4 h-4 text-indigo-600" />
          <span>Query Results & Record Grounding</span>
        </h3>

        {history.map((item) => {
          const matchedStudents = students.filter(s =>
            item.response.matchedIds.includes(s.id)
          );

          return (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs transition space-y-4"
            >
              {/* Question Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-7 h-7 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-xs">
                    Q
                  </div>
                  <h4 className="font-bold text-slate-900 text-base">"{item.question}"</h4>
                </div>
                <div className="flex items-center space-x-2 text-xs text-slate-400">
                  <span className="px-2 py-0.5 rounded bg-slate-100 font-medium text-slate-600">
                    {item.response.provider}
                  </span>
                  <span>{item.timestamp}</span>
                </div>
              </div>

              {/* Answer Content */}
              <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200 text-slate-800 text-sm leading-relaxed">
                <p className="font-normal">{item.response.answer}</p>
                {item.response.reasoning && (
                  <div className="mt-2 text-xs text-slate-500 flex items-center space-x-1.5 pt-2 border-t border-slate-200/60">
                    <span className="font-semibold text-slate-600">Grounding Rationale:</span>
                    <span>{item.response.reasoning}</span>
                  </div>
                )}
              </div>

              {/* Matched Records Cards Preview */}
              {matchedStudents.length > 0 && (
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                    Referenced Student Records ({matchedStudents.length})
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                    {matchedStudents.map((s) => (
                      <div
                        key={s.id}
                        onClick={() => onSelectStudent(s)}
                        className="p-3 rounded-xl border border-indigo-100 bg-indigo-50/40 hover:bg-indigo-50 hover:border-indigo-300 transition cursor-pointer group flex items-center justify-between"
                      >
                        <div>
                          <div className="font-semibold text-xs text-slate-900 group-hover:text-indigo-600 transition flex items-center space-x-1.5">
                            <UserCheck className="w-3.5 h-3.5 text-indigo-600" />
                            <span>{s.name}</span>
                          </div>
                          <div className="text-[11px] text-slate-500 mt-0.5 font-mono">
                            {s.id} • DOB: {s.dob}
                          </div>
                          <div className="text-[11px] text-slate-600 truncate max-w-[190px]">
                            {s.course}
                          </div>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
