import React, { useState, useEffect } from 'react';
import { X, UserPlus, Save, AlertCircle, Sparkles } from 'lucide-react';
import { StudentRecord, StudentFormData } from '../types';

interface StudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: StudentFormData) => Promise<void>;
  initialData?: StudentRecord | null;
  mode: 'create' | 'edit';
}

const COURSES = [
  'Computer Science & Engineering',
  'Data Science & Artificial Intelligence',
  'Cybersecurity & Information Assurance',
  'Cloud Computing & DevOps',
  'Business Analytics & Enterprise Systems',
  'Robotics & Embedded Systems',
  'Software Systems Engineering'
];

export const StudentModal: React.FC<StudentModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  mode,
}) => {
  const [formData, setFormData] = useState<StudentFormData>({
    id: '',
    name: '',
    dob: '',
    email: '',
    phone: '',
    course: COURSES[0],
    address: '',
    enrollment_date: new Date().toISOString().split('T')[0],
    status: 'Active',
    gpa: 3.5,
    emergency_contact: '',
    notes: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData && mode === 'edit') {
      setFormData({
        id: initialData.id,
        name: initialData.name,
        dob: initialData.dob,
        email: initialData.email,
        phone: initialData.phone,
        course: initialData.course,
        address: initialData.address,
        enrollment_date: initialData.enrollment_date,
        status: initialData.status,
        gpa: initialData.gpa,
        emergency_contact: initialData.emergency_contact || '',
        notes: initialData.notes || '',
      });
    } else {
      // Auto-suggest next ID for create mode
      const randomSuffix = Math.floor(100 + Math.random() * 900);
      setFormData({
        id: `STU-${new Date().getFullYear()}-${randomSuffix}`,
        name: '',
        dob: '2005-06-15',
        email: '',
        phone: '+1 (555) 000-0000',
        course: COURSES[0],
        address: '',
        enrollment_date: new Date().toISOString().split('T')[0],
        status: 'Active',
        gpa: 3.5,
        emergency_contact: '',
        notes: '',
      });
    }
    setErrors({});
  }, [initialData, mode, isOpen]);

  if (!isOpen) return null;

  const validate = (): boolean => {
    const errs: Record<string, string> = {};

    if (!formData.name.trim() || formData.name.trim().length < 2) {
      errs.name = 'Full name is required (minimum 2 characters)';
    }

    if (!formData.dob || !/^\d{4}-\d{2}-\d{2}$/.test(formData.dob)) {
      errs.dob = 'Valid date of birth in format YYYY-MM-DD is required';
    } else {
      const birthYear = parseInt(formData.dob.split('-')[0], 10);
      const currentYear = new Date().getFullYear();
      if (birthYear < 1940 || birthYear > currentYear) {
        errs.dob = `Birth year must be between 1940 and ${currentYear}`;
      }
    }

    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errs.email = 'Please provide a valid institutional or personal email address';
    }

    if (!formData.phone.trim()) {
      errs.phone = 'Phone number is required';
    }

    if (formData.gpa < 0 || formData.gpa > 4.0) {
      errs.gpa = 'GPA must be between 0.00 and 4.00';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      onClose();
    } catch (err: unknown) {
      setErrors({ form: (err as Error)?.message || 'Failed to submit form' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const calculateAge = (dob: string) => {
    if (!dob || !/^\d{4}-\d{2}-\d{2}$/.test(dob)) return null;
    const birth = new Date(dob);
    const now = new Date();
    let age = now.getFullYear() - birth.getFullYear();
    const m = now.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) age--;
    return age > 0 ? age : null;
  };

  const currentAge = calculateAge(formData.dob);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full border border-slate-200 overflow-hidden transform transition-all">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
              {mode === 'create' ? <UserPlus className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            </div>
            <div>
              <h3 className="font-semibold text-lg text-white">
                {mode === 'create' ? 'Register New Student' : 'Update Student Record'}
              </h3>
              <p className="text-xs text-slate-400">
                {mode === 'create'
                  ? 'Add a verified student profile into the institutional database'
                  : `Editing record for ${initialData?.name} (${initialData?.id})`}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errors.form && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-700 text-sm flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errors.form}</span>
            </div>
          )}

          {/* Section 1: Identity */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Student ID
              </label>
              <input
                type="text"
                disabled={mode === 'edit'}
                value={formData.id}
                onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                placeholder="STU-2025-001"
                className="w-full px-3 py-2 text-sm border rounded-lg bg-slate-50 border-slate-300 font-mono focus:ring-2 focus:ring-indigo-500 focus:outline-hidden disabled:opacity-75 disabled:cursor-not-allowed"
              />
              <span className="text-[11px] text-slate-400">
                {mode === 'create' ? 'Unique institutional identifier' : 'ID cannot be modified'}
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Full Legal Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Jane Elizabeth Doe"
                className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-hidden ${
                  errors.name ? 'border-rose-400 bg-rose-50/50' : 'border-slate-300'
                }`}
              />
              {errors.name && <p className="text-xs text-rose-600 mt-1">{errors.name}</p>}
            </div>
          </div>

          {/* Section 2: DOB & Age */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Date of Birth <span className="text-rose-500">*</span>
              </label>
              <div className="flex space-x-2">
                <input
                  type="date"
                  required
                  value={formData.dob}
                  onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                  className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-hidden ${
                    errors.dob ? 'border-rose-400 bg-rose-50/50' : 'border-slate-300'
                  }`}
                />
                {currentAge !== null && (
                  <div className="px-3 py-2 bg-indigo-50 border border-indigo-200 text-indigo-700 rounded-lg text-xs font-semibold whitespace-nowrap flex items-center">
                    {currentAge} yrs
                  </div>
                )}
              </div>
              {errors.dob && <p className="text-xs text-rose-600 mt-1">{errors.dob}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Academic Program / Course
              </label>
              <select
                value={formData.course}
                onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              >
                {COURSES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Section 3: Contact Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Contact Email <span className="text-rose-500">*</span>
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="student@edumail.org"
                className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-hidden ${
                  errors.email ? 'border-rose-400 bg-rose-50/50' : 'border-slate-300'
                }`}
              />
              {errors.email && <p className="text-xs text-rose-600 mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Phone Number <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+1 (555) 000-0000"
                className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-hidden ${
                  errors.phone ? 'border-rose-400 bg-rose-50/50' : 'border-slate-300'
                }`}
              />
              {errors.phone && <p className="text-xs text-rose-600 mt-1">{errors.phone}</p>}
            </div>
          </div>

          {/* Section 4: Address */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Residential Address
            </label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="123 University Avenue, City, State, ZIP"
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
            />
          </div>

          {/* Section 5: Academic Standing & Status */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Enrollment Date
              </label>
              <input
                type="date"
                value={formData.enrollment_date}
                onChange={(e) => setFormData({ ...formData, enrollment_date: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Academic Status
              </label>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value as StudentRecord['status'] })
                }
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              >
                <option value="Active">Active</option>
                <option value="On Leave">On Leave</option>
                <option value="Graduated">Graduated</option>
                <option value="Suspended">Suspended</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                GPA (0.0 - 4.0)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="4.0"
                value={formData.gpa}
                onChange={(e) =>
                  setFormData({ ...formData, gpa: parseFloat(e.target.value) || 0 })
                }
                className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-hidden ${
                  errors.gpa ? 'border-rose-400 bg-rose-50/50' : 'border-slate-300'
                }`}
              />
              {errors.gpa && <p className="text-xs text-rose-600 mt-1">{errors.gpa}</p>}
            </div>
          </div>

          {/* Section 6: Emergency Contact & Notes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Emergency Contact
              </label>
              <input
                type="text"
                value={formData.emergency_contact}
                onChange={(e) => setFormData({ ...formData, emergency_contact: e.target.value })}
                placeholder="Parent/Guardian Name (+1 555-xxx-xxxx)"
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Academic Notes & Honors
              </label>
              <input
                type="text"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Scholarships, certifications, research focus"
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center space-x-2 px-5 py-2 text-sm font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30 transition disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Saving Record...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>{mode === 'create' ? 'Save Student Record' : 'Apply Changes'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
