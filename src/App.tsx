import React, { useState, useEffect, useMemo } from 'react';
import {
  Search,
  Filter,
  LayoutGrid,
  List,
  Download,
  Plus,
  RefreshCw,
  Sparkles,
  Calendar,
  SlidersHorizontal,
  X,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { StudentRecord, StudentFormData } from './types';
import {
  fetchStudents,
  createStudent,
  updateStudent,
  deleteStudent,
  resetDatabase
} from './api';
import { Navbar } from './components/Navbar';
import { StatsCards } from './components/StatsCards';
import { StudentTable } from './components/StudentTable';
import { StudentCards } from './components/StudentCards';
import { StudentModal } from './components/StudentModal';
import { StudentDetailModal } from './components/StudentDetailModal';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';
import { AiAssistant } from './components/AiAssistant';
import { ApiExplorer } from './components/ApiExplorer';
import { FastApiCodeModal } from './components/FastApiCodeModal';

export default function App() {
  const [students, setStudents] = useState<StudentRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Active view tab: 'records' | 'ai' | 'api' | 'code'
  const [activeTab, setActiveTab] = useState<'records' | 'ai' | 'api' | 'code'>('records');

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCourse, setSelectedCourse] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [bornAfterYear, setBornAfterYear] = useState<string>('');

  // View presentation
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [sortField, setSortField] = useState<string>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Modals
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [activeStudent, setActiveStudent] = useState<StudentRecord | null>(null);

  const [detailStudent, setDetailStudent] = useState<StudentRecord | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState<boolean>(false);

  const [deleteTargetStudent, setDeleteTargetStudent] = useState<StudentRecord | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false);

  const [isResetting, setIsResetting] = useState<boolean>(false);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3500);
  };

  const loadStudents = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetchStudents();
      setStudents(res.data);
    } catch (err: unknown) {
      setError((err as Error)?.message || 'Failed to load student records');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  // Filtered & Sorted list
  const filteredStudents = useMemo(() => {
    return students
      .filter((s) => {
        // Text Search
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const match =
            s.id.toLowerCase().includes(q) ||
            s.name.toLowerCase().includes(q) ||
            s.email.toLowerCase().includes(q) ||
            s.phone.toLowerCase().includes(q) ||
            s.course.toLowerCase().includes(q) ||
            s.address.toLowerCase().includes(q);
          if (!match) return false;
        }

        // Course filter
        if (selectedCourse !== 'All' && s.course.toLowerCase() !== selectedCourse.toLowerCase()) {
          return false;
        }

        // Status filter
        if (selectedStatus !== 'All' && s.status.toLowerCase() !== selectedStatus.toLowerCase()) {
          return false;
        }

        // Born after filter (e.g. 2005)
        if (bornAfterYear) {
          const cutoff = `${bornAfterYear}-12-31`;
          if (s.dob <= cutoff) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        let valA = (a as unknown as Record<string, unknown>)[sortField] ?? '';
        let valB = (b as unknown as Record<string, unknown>)[sortField] ?? '';

        if (typeof valA === 'string') valA = valA.toLowerCase();
        if (typeof valB === 'string') valB = valB.toLowerCase();

        if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
        if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      });
  }, [students, searchQuery, selectedCourse, selectedStatus, bornAfterYear, sortField, sortOrder]);

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  // CRUD Handlers
  const handleOpenCreate = () => {
    setActiveStudent(null);
    setModalMode('create');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (student: StudentRecord) => {
    setActiveStudent(student);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleOpenDetail = (student: StudentRecord) => {
    setDetailStudent(student);
    setIsDetailOpen(true);
  };

  const handleOpenDelete = (student: StudentRecord) => {
    setDeleteTargetStudent(student);
    setIsDeleteOpen(true);
  };

  const handleFormSubmit = async (formData: StudentFormData) => {
    if (modalMode === 'create') {
      const created = await createStudent(formData);
      setStudents((prev) => [created, ...prev]);
      showNotification(`Student record for ${created.name} successfully created`);
    } else if (modalMode === 'edit' && activeStudent) {
      const updated = await updateStudent(activeStudent.id, formData);
      setStudents((prev) =>
        prev.map((s) => (s.id === updated.id ? updated : s))
      );
      if (detailStudent && detailStudent.id === updated.id) {
        setDetailStudent(updated);
      }
      showNotification(`Student record for ${updated.name} successfully updated`);
    }
  };

  const handleDeleteConfirm = async (id: string) => {
    await deleteStudent(id);
    setStudents((prev) => prev.filter((s) => s.id !== id));
    showNotification(`Student record ${id} removed successfully`);
  };

  const handleResetData = async () => {
    setIsResetting(true);
    try {
      const fresh = await resetDatabase();
      setStudents(fresh);
      showNotification('Institutional database reset to default records');
    } catch (err: unknown) {
      showNotification((err as Error)?.message || 'Failed to reset database', 'error');
    } finally {
      setIsResetting(false);
    }
  };

  // Export functions
  const handleExportCSV = () => {
    const headers = ['ID', 'Name', 'DOB', 'Email', 'Phone', 'Course', 'Address', 'EnrollmentDate', 'Status', 'GPA', 'Notes'];
    const rows = filteredStudents.map(s => [
      s.id,
      `"${s.name}"`,
      s.dob,
      s.email,
      `"${s.phone}"`,
      `"${s.course}"`,
      `"${s.address.replace(/"/g, '""')}"`,
      s.enrollment_date,
      s.status,
      s.gpa,
      `"${(s.notes || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `educore_students_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(filteredStudents, null, 2));
    const link = document.createElement('a');
    link.setAttribute('href', dataStr);
    link.setAttribute('download', `educore_students_export_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const coursesList = useMemo(() => {
    const list = Array.from(new Set(students.map(s => s.course)));
    return ['All', ...list];
  }, [students]);

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 font-sans antialiased flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center space-x-2 px-4 py-3 rounded-xl shadow-xl bg-slate-900 text-white border border-slate-700 text-sm animate-in fade-in slide-in-from-bottom-5">
          {notification.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-400" />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Main Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenCreate={handleOpenCreate}
        onResetData={handleResetData}
        isResetting={isResetting}
        totalCount={students.length}
      />

      {/* Content Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* TAB 1: STUDENT RECORDS (CRUD HUB) */}
        {activeTab === 'records' && (
          <div className="space-y-6">
            {/* Stats Metric Cards */}
            <StatsCards
              students={students}
              onFilterBornAfter2005={() => setBornAfterYear(bornAfterYear === '2005' ? '' : '2005')}
            />

            {/* Filter Bar & Toolbar */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs space-y-3">
              <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
                {/* Search input */}
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by name, student ID, email, course, or address..."
                    className="w-full pl-10 pr-8 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-hidden transition"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Filter Dropdowns */}
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  {/* Course select */}
                  <div className="flex items-center space-x-1.5 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl">
                    <span className="text-slate-500 font-medium">Program:</span>
                    <select
                      value={selectedCourse}
                      onChange={(e) => setSelectedCourse(e.target.value)}
                      className="bg-transparent font-semibold text-slate-800 focus:outline-hidden cursor-pointer"
                    >
                      {coursesList.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Status select */}
                  <div className="flex items-center space-x-1.5 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl">
                    <span className="text-slate-500 font-medium">Status:</span>
                    <select
                      value={selectedStatus}
                      onChange={(e) => setSelectedStatus(e.target.value)}
                      className="bg-transparent font-semibold text-slate-800 focus:outline-hidden cursor-pointer"
                    >
                      <option value="All">All Statuses</option>
                      <option value="Active">Active</option>
                      <option value="On Leave">On Leave</option>
                      <option value="Graduated">Graduated</option>
                      <option value="Suspended">Suspended</option>
                    </select>
                  </div>

                  {/* Cohort button (>2005) */}
                  <button
                    onClick={() => setBornAfterYear(bornAfterYear === '2005' ? '' : '2005')}
                    className={`flex items-center space-x-1 px-3 py-1.5 rounded-xl font-medium border transition ${
                      bornAfterYear === '2005'
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Born &gt; 2005</span>
                    {bornAfterYear === '2005' && <X className="w-3 h-3 ml-1" />}
                  </button>

                  {/* View Mode Toggle */}
                  <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200">
                    <button
                      onClick={() => setViewMode('table')}
                      className={`p-1.5 rounded-lg transition ${
                        viewMode === 'table' ? 'bg-white shadow-xs text-indigo-600' : 'text-slate-500'
                      }`}
                      title="Table View"
                    >
                      <List className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setViewMode('cards')}
                      className={`p-1.5 rounded-lg transition ${
                        viewMode === 'cards' ? 'bg-white shadow-xs text-indigo-600' : 'text-slate-500'
                      }`}
                      title="Cards View"
                    >
                      <LayoutGrid className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Active Filter Indicators */}
              {(selectedCourse !== 'All' || selectedStatus !== 'All' || bornAfterYear || searchQuery) && (
                <div className="flex items-center space-x-2 pt-2 border-t border-slate-100 text-xs">
                  <span className="text-slate-400 font-medium">Active Filters:</span>
                  {selectedCourse !== 'All' && (
                    <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200">
                      <span>Program: {selectedCourse}</span>
                      <button onClick={() => setSelectedCourse('All')}>
                        <X className="w-3 h-3 hover:text-indigo-900" />
                      </button>
                    </span>
                  )}
                  {selectedStatus !== 'All' && (
                    <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200">
                      <span>Status: {selectedStatus}</span>
                      <button onClick={() => setSelectedStatus('All')}>
                        <X className="w-3 h-3 hover:text-indigo-900" />
                      </button>
                    </span>
                  )}
                  {bornAfterYear && (
                    <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200">
                      <span>Born &gt; {bornAfterYear}</span>
                      <button onClick={() => setBornAfterYear('')}>
                        <X className="w-3 h-3 hover:text-indigo-900" />
                      </button>
                    </span>
                  )}
                  {searchQuery && (
                    <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200">
                      <span>Query: "{searchQuery}"</span>
                      <button onClick={() => setSearchQuery('')}>
                        <X className="w-3 h-3 hover:text-indigo-900" />
                      </button>
                    </span>
                  )}
                  <button
                    onClick={() => {
                      setSelectedCourse('All');
                      setSelectedStatus('All');
                      setBornAfterYear('');
                      setSearchQuery('');
                    }}
                    className="text-xs text-indigo-600 hover:underline font-semibold ml-auto"
                  >
                    Clear All
                  </button>
                </div>
              )}
            </div>

            {/* Action Bar & Result Count */}
            <div className="flex items-center justify-between text-xs text-slate-500 px-1">
              <span>
                Showing <strong className="text-slate-800">{filteredStudents.length}</strong> of{' '}
                <strong className="text-slate-800">{students.length}</strong> students registered
              </span>

              <div className="flex items-center space-x-2">
                <button
                  onClick={handleExportCSV}
                  className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium transition shadow-2xs"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Export CSV</span>
                </button>
                <button
                  onClick={handleExportJSON}
                  className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium transition shadow-2xs"
                >
                  <Download className="w-3.5 h-3.5 text-blue-600" />
                  <span>Export JSON</span>
                </button>
              </div>
            </div>

            {/* Data Representation */}
            {loading ? (
              <div className="bg-white rounded-xl border border-slate-200 p-16 text-center shadow-xs">
                <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                <p className="text-sm font-medium text-slate-600">Retrieving student records from database...</p>
              </div>
            ) : viewMode === 'table' ? (
              <StudentTable
                students={filteredStudents}
                onView={handleOpenDetail}
                onEdit={handleOpenEdit}
                onDelete={handleOpenDelete}
                sortField={sortField}
                sortOrder={sortOrder}
                onSort={handleSort}
              />
            ) : (
              <StudentCards
                students={filteredStudents}
                onView={handleOpenDetail}
                onEdit={handleOpenEdit}
                onDelete={handleOpenDelete}
              />
            )}
          </div>
        )}

        {/* TAB 2: NATURAL LANGUAGE QUERY ASSISTANT */}
        {activeTab === 'ai' && (
          <AiAssistant
            students={students}
            onSelectStudent={(student) => {
              setDetailStudent(student);
              setIsDetailOpen(true);
            }}
          />
        )}

        {/* TAB 3: REST API TESTER */}
        {activeTab === 'api' && (
          <ApiExplorer students={students} onRefreshData={loadStudents} />
        )}

        {/* TAB 4: FASTAPI STANDALONE CODEBASE */}
        {activeTab === 'code' && <FastApiCodeModal />}
      </main>

      {/* Modals */}
      <StudentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={activeStudent}
        mode={modalMode}
      />

      <StudentDetailModal
        isOpen={isDetailOpen}
        student={detailStudent}
        onClose={() => setIsDetailOpen(false)}
        onEdit={(student) => {
          setIsDetailOpen(false);
          handleOpenEdit(student);
        }}
        onDelete={(student) => {
          setIsDetailOpen(false);
          handleOpenDelete(student);
        }}
      />

      <DeleteConfirmModal
        isOpen={isDeleteOpen}
        student={deleteTargetStudent}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDeleteConfirm}
      />

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-slate-800">EduCore SIS</span>
            <span>•</span>
            <span>Enterprise Student Information & Records Platform</span>
          </div>
          <div className="flex items-center space-x-4 text-slate-400">
            <span>FastAPI + SQLite Engine</span>
            <span>•</span>
            <span>Natural Language Grounding</span>
            <span>•</span>
            <span>REST API Verified</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
