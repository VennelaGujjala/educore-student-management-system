import React from 'react';
import { Edit2, Trash2, Eye, Mail, Phone, MapPin, Calendar, Award } from 'lucide-react';
import { StudentRecord } from '../types';

interface StudentCardsProps {
  students: StudentRecord[];
  onView: (student: StudentRecord) => void;
  onEdit: (student: StudentRecord) => void;
  onDelete: (student: StudentRecord) => void;
}

export const StudentCards: React.FC<StudentCardsProps> = ({
  students,
  onView,
  onEdit,
  onDelete,
}) => {
  const calculateAge = (dob: string) => {
    const birth = new Date(dob);
    const now = new Date();
    let age = now.getFullYear() - birth.getFullYear();
    const m = now.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {students.map((student) => {
        const age = calculateAge(student.dob);
        const isBornAfter2005 = parseInt(student.dob.split('-')[0], 10) > 2005;

        return (
          <div
            key={student.id}
            className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs hover:shadow-md transition flex flex-col justify-between group"
          >
            <div>
              {/* Header with avatar & status */}
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-slate-800 to-indigo-600 text-white font-bold flex items-center justify-center text-sm shadow-sm">
                    {student.name
                      .split(' ')
                      .map((n) => n[0])
                      .slice(0, 2)
                      .join('')}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 group-hover:text-indigo-600 transition">
                      {student.name}
                    </h4>
                    <span className="font-mono text-xs font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                      {student.id}
                    </span>
                  </div>
                </div>

                <span
                  className={`text-xs px-2.5 py-0.5 rounded-full font-semibold border ${
                    student.status === 'Active'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : student.status === 'On Leave'
                      ? 'bg-amber-50 text-amber-700 border-amber-200'
                      : student.status === 'Graduated'
                      ? 'bg-blue-50 text-blue-700 border-blue-200'
                      : 'bg-rose-50 text-rose-700 border-rose-200'
                  }`}
                >
                  {student.status}
                </span>
              </div>

              {/* Course & Academic Details */}
              <div className="mt-4 pt-3 border-t border-slate-100">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Program of Study
                </p>
                <p className="text-sm font-medium text-slate-800 mt-0.5 line-clamp-1">
                  {student.course}
                </p>
              </div>

              {/* Metadata Badges */}
              <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                <div className="flex items-center space-x-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>DOB: {student.dob}</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <span className="font-medium text-slate-700">Age: {age} yrs</span>
                  {isBornAfter2005 && (
                    <span className="text-[10px] px-1 rounded bg-indigo-100 text-indigo-700">
                      &gt;2005
                    </span>
                  )}
                </div>
                <div className="flex items-center space-x-1.5 col-span-2">
                  <Award className="w-3.5 h-3.5 text-amber-500" />
                  <span className="font-semibold text-slate-800">GPA: {student.gpa.toFixed(2)}</span>
                  <span className="text-slate-400">/ 4.00</span>
                </div>
              </div>

              {/* Contact summary */}
              <div className="mt-3 space-y-1.5 text-xs text-slate-500">
                <div className="flex items-center space-x-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{student.email}</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{student.phone}</span>
                </div>
                {student.address && (
                  <div className="flex items-center space-x-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{student.address}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">
                Enrolled {student.enrollment_date}
              </span>
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => onView(student)}
                  className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                  title="View Profile"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onEdit(student)}
                  className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                  title="Edit Record"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDelete(student)}
                  className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                  title="Delete Record"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
