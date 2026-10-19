import React from 'react';
import { Users, Award, BookOpen, Calendar, CheckCircle2 } from 'lucide-react';
import { StudentRecord } from '../types';

interface StatsCardsProps {
  students: StudentRecord[];
  onFilterBornAfter2005: () => void;
}

export const StatsCards: React.FC<StatsCardsProps> = ({ students, onFilterBornAfter2005 }) => {
  const total = students.length;
  const activeCount = students.filter(s => s.status === 'Active').length;
  const bornAfter2005Count = students.filter(s => {
    const year = parseInt(s.dob.split('-')[0], 10);
    return year > 2005;
  }).length;

  const avgGpa = total > 0
    ? (students.reduce((acc, s) => acc + (s.gpa || 0), 0) / total).toFixed(2)
    : '0.00';

  const coursesCount = new Set(students.map(s => s.course)).size;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      {/* 1. Total Students */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-xs hover:shadow-md transition">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Total Enrolled
            </p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{total}</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
            <Users className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-3 flex items-center text-xs text-slate-600">
          <span className="inline-flex items-center text-emerald-600 font-medium mr-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> {activeCount} Active
          </span>
          <span>({total > 0 ? Math.round((activeCount / total) * 100) : 0}%)</span>
        </div>
      </div>

      {/* 2. Cumulative Average GPA */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-xs hover:shadow-md transition">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Average GPA
            </p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{avgGpa}</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
            <Award className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-3 text-xs text-slate-500">
          Scale: 4.00 Grade Point Average
        </div>
      </div>

      {/* 3. Born After 2005 (Target cohort query highlight) */}
      <div
        onClick={onFilterBornAfter2005}
        className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-xs hover:shadow-md transition cursor-pointer group hover:border-indigo-300"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 group-hover:text-indigo-600 transition">
              Born After 2005
            </p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{bornAfter2005Count}</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 group-hover:scale-110 transition">
            <Calendar className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-3 flex items-center justify-between text-xs text-indigo-600 font-medium">
          <span>Click to filter cohort</span>
          <span>→</span>
        </div>
      </div>

      {/* 4. Active Programs */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-xs hover:shadow-md transition">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Degree Programs
            </p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{coursesCount}</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
            <BookOpen className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-3 text-xs text-slate-500 truncate">
          Engineering, Data Science & Tech
        </div>
      </div>
    </div>
  );
};
