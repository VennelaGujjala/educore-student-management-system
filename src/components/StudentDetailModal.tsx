import React from 'react';
import { X, Mail, Phone, MapPin, Calendar, Award, GraduationCap, Clock, Edit2, Trash2, ShieldCheck, Printer } from 'lucide-react';
import { StudentRecord } from '../types';

interface StudentDetailModalProps {
  student: StudentRecord | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (student: StudentRecord) => void;
  onDelete: (student: StudentRecord) => void;
}

export const StudentDetailModal: React.FC<StudentDetailModalProps> = ({
  student,
  isOpen,
  onClose,
  onEdit,
  onDelete,
}) => {
  if (!isOpen || !student) return null;

  const calculateAge = (dob: string) => {
    const birth = new Date(dob);
    const now = new Date();
    let age = now.getFullYear() - birth.getFullYear();
    const m = now.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) age--;
    return age;
  };

  const age = calculateAge(student.dob);
  const isBornAfter2005 = parseInt(student.dob.split('-')[0], 10) > 2005;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full border border-slate-200 overflow-hidden transform transition-all">
        {/* Top bar */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <GraduationCap className="w-5 h-5 text-indigo-400" />
            <span className="font-semibold text-sm tracking-wide uppercase text-slate-300">
              Student Information & ID Credential
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
              title="Print Record"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Official Digital Student ID Card Header */}
          <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden border border-slate-800">
            {/* Background design elements */}
            <div className="absolute top-0 right-0 -mt-8 -mr-8 w-40 h-40 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none"></div>
            <div className="absolute bottom-0 left-1/3 -mb-6 w-32 h-32 bg-blue-500/10 rounded-full blur-xl pointer-events-none"></div>

            <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
              {/* Avatar Photo Frame */}
              <div className="relative">
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-tr from-indigo-500 to-blue-400 p-0.5 shadow-lg">
                  <div className="w-full h-full bg-slate-900 rounded-2xl flex items-center justify-center font-bold text-2xl text-white">
                    {student.name
                      .split(' ')
                      .map((n) => n[0])
                      .slice(0, 2)
                      .join('')}
                  </div>
                </div>
                <div className="absolute -bottom-2 -right-2 px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-600 text-white uppercase tracking-wider border border-slate-900">
                  {student.status}
                </div>
              </div>

              {/* Identity details */}
              <div className="flex-1 text-center sm:text-left">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="text-2xl font-bold tracking-tight text-white">{student.name}</h2>
                    <p className="text-indigo-300 font-medium text-sm mt-0.5">{student.course}</p>
                  </div>
                  <div className="mt-2 sm:mt-0 font-mono text-xs px-3 py-1 bg-white/10 rounded-lg border border-white/20 text-white font-semibold">
                    {student.id}
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs text-slate-300 pt-3 border-t border-white/10">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase">Date of Birth</span>
                    <span className="font-semibold text-white">{student.dob}</span>
                    <span className="ml-1 text-[11px] text-indigo-300">({age} yrs)</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase">Enrolled</span>
                    <span className="font-semibold text-white">{student.enrollment_date}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase">Cumulative GPA</span>
                    <span className="font-semibold text-amber-400">{student.gpa.toFixed(2)} / 4.00</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Contact & Residential */}
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-3 flex items-center space-x-1.5">
                <Mail className="w-4 h-4 text-indigo-600" />
                <span>Contact & Residential Information</span>
              </h4>
              <div className="space-y-2.5 text-sm">
                <div>
                  <span className="text-xs text-slate-500 block">Institutional Email</span>
                  <span className="font-medium text-slate-800 break-all">{student.email}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-500 block">Phone Contact</span>
                  <span className="font-medium text-slate-800">{student.phone}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-500 block">Residential Address</span>
                  <span className="font-medium text-slate-800">
                    {student.address || 'Campus Residence / Unspecified'}
                  </span>
                </div>
                {student.emergency_contact && (
                  <div>
                    <span className="text-xs text-slate-500 block">Emergency Contact</span>
                    <span className="font-medium text-slate-800">{student.emergency_contact}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Academic & Standing */}
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-3 flex items-center space-x-1.5">
                <Award className="w-4 h-4 text-amber-600" />
                <span>Academic Record & Notes</span>
              </h4>
              <div className="space-y-2.5 text-sm">
                <div>
                  <span className="text-xs text-slate-500 block">Department / Major</span>
                  <span className="font-medium text-slate-800">{student.course}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-500 block">Cohort Eligibility</span>
                  <div className="flex items-center space-x-2 mt-0.5">
                    {isBornAfter2005 ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-indigo-100 text-indigo-700">
                        Born After 2005 Cohort
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-slate-200 text-slate-700">
                        Senior Cohort (Born &le; 2005)
                      </span>
                    )}
                  </div>
                </div>
                <div>
                  <span className="text-xs text-slate-500 block">Academic Notes</span>
                  <p className="text-xs text-slate-700 mt-0.5 bg-white p-2 rounded-lg border border-slate-200">
                    {student.notes || 'No disciplinary infractions or specialized notes recorded.'}
                  </p>
                </div>
                {student.created_at && (
                  <div className="text-[11px] text-slate-400 flex items-center space-x-1 pt-1">
                    <Clock className="w-3 h-3" />
                    <span>Record Created: {new Date(student.created_at).toLocaleString()}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
            <button
              onClick={() => {
                onClose();
                onDelete(student);
              }}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-lg transition"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete Student</span>
            </button>

            <div className="flex items-center space-x-2">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition"
              >
                Close
              </button>
              <button
                onClick={() => {
                  onClose();
                  onEdit(student);
                }}
                className="inline-flex items-center space-x-2 px-4 py-2 text-sm font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30 transition"
              >
                <Edit2 className="w-4 h-4" />
                <span>Edit Profile</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
