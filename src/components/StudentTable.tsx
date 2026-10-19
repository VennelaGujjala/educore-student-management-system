import React from 'react';
import { Edit2, Trash2, Eye, Mail, Phone, ArrowUpDown, ShieldCheck } from 'lucide-react';
import { StudentRecord } from '../types';

interface StudentTableProps {
  students: StudentRecord[];
  onView: (student: StudentRecord) => void;
  onEdit: (student: StudentRecord) => void;
  onDelete: (student: StudentRecord) => void;
  sortField: string;
  sortOrder: 'asc' | 'desc';
  onSort: (field: string) => void;
}

export const StudentTable: React.FC<StudentTableProps> = ({
  students,
  onView,
  onEdit,
  onDelete,
  sortField,
  sortOrder,
  onSort,
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

  const getStatusBadge = (status: StudentRecord['status']) => {
    switch (status) {
      case 'Active':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse"></span>
            Active
          </span>
        );
      case 'On Leave':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-1.5"></span>
            On Leave
          </span>
        );
      case 'Graduated':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            <ShieldCheck className="w-3 h-3 mr-1" />
            Graduated
          </span>
        );
      case 'Suspended':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            Suspended
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
            {status}
          </span>
        );
    }
  };

  if (students.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-12 text-center shadow-xs">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
          <Eye className="w-8 h-8" />
        </div>
        <h3 className="text-base font-semibold text-slate-800">No Student Records Found</h3>
        <p className="text-sm text-slate-500 mt-1 max-w-md mx-auto">
          No records matched your current search filters or criteria. Try clearing search filters or add a new student.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
          <thead className="bg-slate-50/80 text-xs font-semibold text-slate-600 uppercase tracking-wider">
            <tr>
              <th
                onClick={() => onSort('id')}
                className="py-3.5 px-4 cursor-pointer hover:bg-slate-100/80 transition"
              >
                <div className="flex items-center space-x-1">
                  <span>Student ID</span>
                  <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                </div>
              </th>
              <th
                onClick={() => onSort('name')}
                className="py-3.5 px-4 cursor-pointer hover:bg-slate-100/80 transition"
              >
                <div className="flex items-center space-x-1">
                  <span>Full Name</span>
                  <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                </div>
              </th>
              <th
                onClick={() => onSort('dob')}
                className="py-3.5 px-4 cursor-pointer hover:bg-slate-100/80 transition"
              >
                <div className="flex items-center space-x-1">
                  <span>Date of Birth (Age)</span>
                  <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                </div>
              </th>
              <th className="py-3.5 px-4">Contact Details</th>
              <th
                onClick={() => onSort('course')}
                className="py-3.5 px-4 cursor-pointer hover:bg-slate-100/80 transition"
              >
                <div className="flex items-center space-x-1">
                  <span>Program / Course</span>
                  <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                </div>
              </th>
              <th
                onClick={() => onSort('gpa')}
                className="py-3.5 px-4 cursor-pointer hover:bg-slate-100/80 transition"
              >
                <div className="flex items-center space-x-1">
                  <span>GPA</span>
                  <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                </div>
              </th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700 font-normal">
            {students.map((student) => {
              const age = calculateAge(student.dob);
              const isBornAfter2005 = parseInt(student.dob.split('-')[0], 10) > 2005;

              return (
                <tr
                  key={student.id}
                  className="hover:bg-indigo-50/30 transition-colors group"
                >
                  {/* ID */}
                  <td className="py-3.5 px-4 font-mono font-medium text-xs text-indigo-700 whitespace-nowrap">
                    {student.id}
                  </td>

                  {/* Name + Initials */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-slate-700 to-indigo-600 text-white font-semibold flex items-center justify-center text-xs shadow-xs">
                        {student.name
                          .split(' ')
                          .map((n) => n[0])
                          .slice(0, 2)
                          .join('')}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900 group-hover:text-indigo-600 transition">
                          {student.name}
                        </div>
                        <div className="text-xs text-slate-400 truncate max-w-[180px]">
                          {student.address || 'Address on file'}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* DOB & Age */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="text-slate-800 text-sm font-medium">{student.dob}</div>
                    <div className="flex items-center space-x-1.5 mt-0.5">
                      <span className="text-xs text-slate-500">{age} yrs old</span>
                      {isBornAfter2005 && (
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-indigo-100 text-indigo-700 font-medium">
                          &gt; 2005
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Contact */}
                  <td className="py-3.5 px-4 text-xs whitespace-nowrap">
                    <div className="flex items-center space-x-1.5 text-slate-600">
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                      <span className="truncate max-w-[160px]">{student.email}</span>
                    </div>
                    <div className="flex items-center space-x-1.5 text-slate-500 mt-1">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <span>{student.phone}</span>
                    </div>
                  </td>

                  {/* Course */}
                  <td className="py-3.5 px-4">
                    <div className="inline-block max-w-[200px]">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-800 truncate">
                        {student.course}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      Enrolled: {student.enrollment_date}
                    </div>
                  </td>

                  {/* GPA */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="font-semibold text-slate-900 text-sm">
                      {student.gpa.toFixed(2)}
                    </div>
                    <div className="w-16 h-1.5 bg-slate-100 rounded-full mt-1 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          student.gpa >= 3.8
                            ? 'bg-emerald-500'
                            : student.gpa >= 3.5
                            ? 'bg-blue-500'
                            : 'bg-amber-500'
                        }`}
                        style={{ width: `${Math.min(100, (student.gpa / 4.0) * 100)}%` }}
                      ></div>
                    </div>
                  </td>

                  {/* Status */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    {getStatusBadge(student.status)}
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <div className="inline-flex items-center space-x-1">
                      <button
                        onClick={() => onView(student)}
                        title="View Full Profile"
                        className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onEdit(student)}
                        title="Edit Details"
                        className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDelete(student)}
                        title="Delete Record"
                        className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
