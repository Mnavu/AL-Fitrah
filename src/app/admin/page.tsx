'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { jsPDF } from 'jspdf';
import { STATIC_ASSETS } from '@/lib/assets';
import {
  Users,
  MessageSquare,
  Clock,
  CheckCircle2,
  Mail,
  Phone as PhoneIcon,
  ChevronRight,
  X,
  Printer,
  FileText,
  Eye,
  Loader2,
  User,
  Shield,
  Heart,
  CreditCard,
} from 'lucide-react';

// ─── Types ───────────────────────────────────────────────────────────────────

interface Registration {
  id: string;
  created_at: string;
  full_name: string;
  student_email: string;
  student_phone: string;
  guardian_name?: string;
  guardian_phone?: string;
  course_id?: string;
  status: string;
  courses: { title: string }[];
}

interface DocumentRecord {
  id: string;
  document_type: string;
  file_path: string;
}

interface RegistrationDetail {
  id: string;
  created_at: string;
  full_name: string;
  date_of_birth: string;
  gender: string;
  nationality: string;
  address: string;
  city: string;
  student_email: string;
  student_phone: string;
  guardian_name: string;
  guardian_relationship: string;
  guardian_phone: string;
  medical_conditions_details: string;
  allergies: string;
  course_id: string;
  status: string;
  amount_paid: string;
  payment_reference: string;
  notes: string;
  declaration: boolean;
  emergency_contact_name: string;
  emergency_contact_phone: string;
  courses: { title: string }[];
  documents: DocumentRecord[];
}

interface Message {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  created_at: string;
}

// ─── Constants ───────────────────────────────────────────────────────────────

const DOC_TYPE_LABELS: Record<string, string> = {
  birth_cert: 'Birth Certificate / National ID',
  parent_id: 'Parent / Guardian National ID',
  passport_photos: 'Passport-size Photographs (×2)',
  school_report: 'Previous School Report',
  medical_report: 'Medical Report',
  emergency_info: 'Emergency Contact Document',
};

// ─── Helper components ────────────────────────────────────────────────────────

function InfoCard({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm h-fit">
      <div className="flex items-center gap-3 mb-5 pb-4 border-b border-gray-50">
        <div className="bg-[#07CAC3]/10 p-2 rounded-xl text-[#07CAC3]">{icon}</div>
        <h3 className="font-bold text-[#0f5257] text-sm uppercase tracking-wider">{title}</h3>
      </div>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function InfoField({ label, value, mono }: { label: string; value?: string; mono?: boolean }) {
  return (
    <div className="flex items-start gap-2">
      <span className="text-xs text-gray-400 font-bold uppercase tracking-wide shrink-0 w-28 pt-0.5">{label}</span>
      <span className={`text-sm break-all ${mono ? 'font-mono bg-gray-50 px-2 py-0.5 rounded text-[#0f5257] font-bold' : 'text-gray-700 font-medium'}`}>
        {value || '—'}
      </span>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'registrations' | 'messages'>('registrations');
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Detail modal state
  const [showModal, setShowModal] = useState(false);
  const [selectedReg, setSelectedReg] = useState<RegistrationDetail | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [printingPDF, setPrintingPDF] = useState(false);

  // ── Data fetching ─────────────────────────────────────────────────────────

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data: regData, error: regError } = await supabase
        .from('registrations')
        .select(`id, created_at, full_name, student_email, student_phone, guardian_name, guardian_phone, course_id, status, courses(title)`)
        .order('created_at', { ascending: false });

      if (regError) throw regError;
      setRegistrations((regData as any) || []);

      const { data: msgData, error: msgError } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (msgError) throw msgError;
      setMessages(msgData || []);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch dashboard data.');
      toast.error('Data Fetch Error', { description: err.message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.push('/login'); return; }
      fetchData();
    };
    checkUser();
  }, [router]);

  // ── Status update ─────────────────────────────────────────────────────────

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('registrations')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;

      setRegistrations(prev => prev.map(r => r.id === id ? { ...r, status: newStatus } : r));
      if (selectedReg?.id === id) {
        setSelectedReg(prev => prev ? { ...prev, status: newStatus } : null);
      }
      toast.success(`Status updated to ${newStatus}`);
    } catch (err: any) {
      toast.error('Update Failed', { description: err.message });
    }
  };

  // ── Open detail modal ─────────────────────────────────────────────────────

  const openDetail = async (id: string) => {
    setShowModal(true);
    setSelectedReg(null);
    setLoadingDetail(true);
    try {
      const { data: reg, error: regError } = await supabase
        .from('registrations')
        .select('*, courses(title)')
        .eq('id', id)
        .single();

      if (regError) throw regError;

      const { data: docs } = await supabase
        .from('student_documents')
        .select('*')
        .eq('registration_id', id);

      setSelectedReg({ ...reg, documents: docs || [] });
    } catch (err: any) {
      toast.error('Failed to load registration details', { description: err.message });
      setShowModal(false);
    } finally {
      setLoadingDetail(false);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedReg(null);
  };

  // ── Print PDF ─────────────────────────────────────────────────────────────

  const printRegistrationPDF = async (reg: RegistrationDetail) => {
    setPrintingPDF(true);
    try {
      const doc = new jsPDF();
      const pageW = 210;
      const margin = 15;
      const contentW = pageW - margin * 2;
      const midnight: [number, number, number] = [15, 82, 87];
      const turquoise: [number, number, number] = [7, 202, 195];
      const lightTeal: [number, number, number] = [240, 253, 250];

      let y = 0;

      // Header background
      doc.setFillColor(...lightTeal);
      doc.rect(0, 0, 210, 52, 'F');
      doc.setFillColor(...turquoise);
      doc.rect(0, 0, 4, 297, 'F');

      // Logo (same canvas multiply trick as the receipt)
      try {
        const img = new Image();
        img.src = STATIC_ASSETS.logoAlt;
        await new Promise(r => { img.onload = r; img.onerror = r; });
        if (img.complete && img.naturalWidth !== 0) {
          const canvas = document.createElement('canvas');
          canvas.width = img.naturalWidth;
          canvas.height = img.naturalHeight;
          const ctx = canvas.getContext('2d')!;
          ctx.fillStyle = '#f0fdfa';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.globalCompositeOperation = 'multiply';
          ctx.drawImage(img, 0, 0);
          doc.addImage(canvas.toDataURL('image/jpeg'), 'JPEG', margin, 10, 40, 18);
        }
      } catch {}

      // Header text
      doc.setFontSize(18); doc.setFont('helvetica', 'bold');
      doc.setTextColor(...midnight);
      doc.text('AL-FITRAH', 195, 18, { align: 'right' });
      doc.setFontSize(8); doc.setFont('helvetica', 'normal');
      doc.setTextColor(100);
      doc.text('TRAINING INSTITUTE', 195, 24, { align: 'right' });
      doc.setFontSize(7); doc.setFont('helvetica', 'bold');
      doc.setTextColor(...turquoise);
      doc.text('OFFICIAL ADMISSION RECORD', 195, 30, { align: 'right' });
      doc.setFontSize(7); doc.setFont('helvetica', 'normal');
      doc.setTextColor(130);
      doc.text(`ID: ${reg.id.substring(0, 8).toUpperCase()}  ·  ${new Date(reg.created_at).toLocaleDateString()}`, 195, 37, { align: 'right' });

      // Status stamp (top-right circle)
      const statusOk = reg.status === 'Approved' || reg.status === 'Paid';
      const stampColor: [number, number, number] = statusOk ? [22, 163, 74] : [202, 138, 4];
      doc.setDrawColor(...stampColor);
      doc.setLineWidth(1);
      doc.circle(185, 73, 12);
      doc.setFontSize(6.5); doc.setFont('helvetica', 'bold');
      doc.setTextColor(...stampColor);
      doc.text(reg.status.toUpperCase(), 185, 71, { align: 'center' });
      doc.text('STATUS', 185, 76, { align: 'center' });

      y = 60;

      // Section header helper
      const section = (title: string) => {
        if (y > 260) { doc.addPage(); y = 20; }
        doc.setFillColor(...midnight);
        doc.roundedRect(margin, y, contentW, 7, 1, 1, 'F');
        doc.setFontSize(8); doc.setFont('helvetica', 'bold');
        doc.setTextColor(255);
        doc.text(title, margin + 4, y + 5);
        y += 11;
      };

      // Field helper
      const field = (label: string, value: string) => {
        if (y > 272) { doc.addPage(); y = 20; }
        doc.setFontSize(8); doc.setFont('helvetica', 'bold');
        doc.setTextColor(110);
        doc.text(`${label}:`, margin + 4, y);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(30);
        const lines = doc.splitTextToSize(value || '—', contentW - 62);
        doc.text(lines, margin + 58, y);
        y += (lines.length > 1 ? lines.length * 4.5 : 0) + 6.5;
      };

      // ── Section 1: Student
      section('1. Student Information');
      field('Full Name', reg.full_name);
      field('Date of Birth', reg.date_of_birth ? new Date(reg.date_of_birth).toLocaleDateString() : '');
      field('Gender', reg.gender || '');
      field('Nationality', reg.nationality || '');
      field('Address', reg.address || '');
      field('City', reg.city || '');
      field('Phone', reg.student_phone || '');
      field('Email', reg.student_email || '');
      y += 3;

      // ── Section 2: Guardian
      section('2. Guardian / Parent Information');
      field('Full Name', reg.guardian_name || '');
      field('Relationship', reg.guardian_relationship || '');
      field('Phone', reg.guardian_phone || '');
      y += 3;

      // ── Section 3: Medical
      section('3. Medical Information');
      field('Medical Conditions', reg.medical_conditions_details || 'None disclosed');
      field('Allergies', reg.allergies || 'None disclosed');
      y += 3;

      // ── Section 4: Course & Payment
      section('4. Course & Payment');
      const courseTitle = (reg.courses as any)?.[0]?.title || 'Unknown Course';
      field('Applied Course', courseTitle);
      field('Amount Paid', reg.amount_paid ? `KES ${parseInt(reg.amount_paid).toLocaleString()}` : '');
      field('M-Pesa Reference', reg.payment_reference || '');
      field('Notes', reg.notes || '');
      y += 3;

      // ── Section 5: Documents
      section('5. Uploaded Documents');
      if (reg.documents.length > 0) {
        reg.documents.forEach(docItem => {
          if (y > 272) { doc.addPage(); y = 20; }
          const label = DOC_TYPE_LABELS[docItem.document_type] || docItem.document_type;
          const isReal = !docItem.file_path.startsWith('simulation://');
          doc.setFontSize(8); doc.setFont('helvetica', 'bold');
          doc.setTextColor(
            isReal ? turquoise[0] : 150,
            isReal ? turquoise[1] : 150,
            isReal ? turquoise[2] : 150,
          );
          doc.text(`✓ ${label}`, margin + 4, y);
          doc.setFont('helvetica', 'normal');
          doc.setTextColor(100);
          const urlLine = isReal
            ? doc.splitTextToSize(docItem.file_path, contentW - 10)[0]
            : 'Upload pending';
          doc.text(urlLine, margin + 6, y + 4.5);
          y += 10;
        });
      } else {
        doc.setFontSize(8); doc.setFont('helvetica', 'italic');
        doc.setTextColor(150);
        doc.text('No documents recorded for this registration.', margin + 4, y);
        y += 7;
      }

      // Footer
      doc.setDrawColor(220);
      doc.line(margin, 282, 195, 282);
      doc.setFontSize(7); doc.setFont('helvetica', 'italic');
      doc.setTextColor(160);
      doc.text(
        'Official admission record — Al-Fitrah Training Institute · South C & Karen Campuses · Nairobi, Kenya',
        105, 287, { align: 'center' },
      );

      doc.save(`AlFitrah_Admission_${reg.full_name.replace(/\s+/g, '_')}.pdf`);
      toast.success('PDF downloaded successfully');
    } catch (err: any) {
      toast.error('Failed to generate PDF', { description: err.message });
    } finally {
      setPrintingPDF(false);
    }
  };

  // ─── Render ───────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F8FAFC]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#07CAC3] mb-4" />
        <p className="text-[#0f5257] font-bold">Loading Admin Portal...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20">

      {/* Header */}
      <div className="bg-[#0f5257] text-white py-12 px-4 shadow-lg">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <h1 className="text-4xl font-serif font-bold mb-2">Management Portal</h1>
            <p className="text-[#91E0CD] font-medium">Overseeing Admissions & Inquiries</p>
          </div>
          <div className="flex bg-white/10 p-1 rounded-2xl backdrop-blur-md">
            <button
              type="button"
              onClick={() => setActiveTab('registrations')}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${activeTab === 'registrations' ? 'bg-[#07CAC3] text-white shadow-lg' : 'text-white/70 hover:text-white'}`}
            >
              <Users size={20} /> Admissions ({registrations.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('messages')}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${activeTab === 'messages' ? 'bg-[#07CAC3] text-white shadow-lg' : 'text-white/70 hover:text-white'}`}
            >
              <MessageSquare size={20} /> Inquiries ({messages.length})
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-8">
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8 rounded-r-xl shadow-md">
            <p className="text-red-700 font-bold">Error: {error}</p>
          </div>
        )}

        {activeTab === 'registrations' ? (
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
              <h2 className="text-xl font-bold text-[#0f5257] flex items-center gap-2">
                <Users className="text-[#07CAC3]" /> Recent Admissions
              </h2>
              <button type="button" onClick={fetchData} className="text-[#07CAC3] hover:text-[#0f5257] font-bold text-sm">
                Refresh List
              </button>
            </div>

            <div className="overflow-x-auto">
              {registrations.length > 0 ? (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-widest font-black">
                      <th className="px-6 py-4">Student & Contact</th>
                      <th className="px-6 py-4">Applied Course</th>
                      <th className="px-6 py-4">Guardian Info</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {registrations.map((reg) => (
                      <tr key={reg.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <p className="font-bold text-[#0f5257]">{reg.full_name}</p>
                          <div className="flex flex-col text-xs text-gray-500 mt-1">
                            <span className="flex items-center gap-1"><Mail size={12} /> {reg.student_email}</span>
                            <span className="flex items-center gap-1 mt-0.5"><PhoneIcon size={12} /> {reg.student_phone}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="bg-[#07CAC3]/10 text-[#0f5257] px-3 py-1 rounded-full text-xs font-bold">
                            {(reg.courses as any)?.[0]?.title || 'Unknown Course'}
                          </span>
                          <p className="text-[10px] text-gray-400 mt-1 uppercase font-bold tracking-tighter">
                            Applied: {new Date(reg.created_at).toLocaleDateString()}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          {reg.guardian_name ? (
                            <>
                              <p className="text-sm font-semibold text-gray-700">{reg.guardian_name}</p>
                              <p className="text-xs text-gray-500">{reg.guardian_phone}</p>
                            </>
                          ) : (
                            <span className="text-gray-300 italic text-xs">No Guardian Data</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                            reg.status === 'Approved' || reg.status === 'Paid'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            {reg.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            {reg.status !== 'Approved' && (
                              <button
                                type="button"
                                onClick={() => handleUpdateStatus(reg.id, 'Approved')}
                                className="bg-[#07CAC3] text-white p-2 rounded-lg hover:bg-[#0f5257] transition-all shadow-sm"
                                title="Approve Registration"
                              >
                                <CheckCircle2 size={16} />
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => openDetail(reg.id)}
                              className="bg-gray-100 text-gray-600 p-2 rounded-lg hover:bg-[#0f5257] hover:text-white transition-all"
                              title="View full registration & documents"
                            >
                              <ChevronRight size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="py-20 text-center">
                  <p className="text-gray-400 font-serif text-xl italic">No admissions recorded yet.</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="grid gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {messages.length > 0 ? (
              messages.map((msg) => (
                <div key={msg.id} className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 hover:border-[#07CAC3] transition-all group">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-[#07CAC3]/10 flex items-center justify-center text-[#07CAC3] group-hover:bg-[#07CAC3] group-hover:text-white transition-all">
                        <Mail size={24} />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-[#0f5257]">{msg.name}</h3>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1 font-medium"><Mail size={14} /> {msg.email}</span>
                          {msg.phone && <span className="flex items-center gap-1 font-medium"><PhoneIcon size={14} /> {msg.phone}</span>}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-xl border border-gray-100">
                      <Clock size={14} className="text-[#07CAC3]" />
                      <span className="text-xs font-bold text-gray-500 uppercase tracking-tighter">
                        {new Date(msg.created_at).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 relative">
                    <div className="absolute top-4 left-6 text-[#07CAC3] opacity-20 font-serif text-6xl">"</div>
                    <div className="relative z-10">
                      <p className="font-black text-[#0f5257] uppercase text-xs tracking-widest mb-3 border-b border-gray-200 pb-2">
                        Subject: {msg.subject}
                      </p>
                      <p className="text-gray-700 leading-relaxed italic whitespace-pre-wrap">{msg.message}</p>
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end gap-3">
                    <a
                      href={`mailto:${msg.email}?subject=Re: ${msg.subject}`}
                      className="bg-[#0f5257] text-white px-6 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-[#077B83] transition-all"
                    >
                      <Mail size={16} /> Reply via Email
                    </a>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white rounded-3xl py-20 text-center shadow-lg border border-dashed border-gray-200">
                <MessageSquare className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                <p className="text-gray-400 font-serif text-xl italic">No inquiries received yet.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ─── Registration Detail Modal ──────────────────────────────────────── */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={closeModal} />

          {/* Panel */}
          <div
            className="relative bg-[#F8FAFC] rounded-[2rem] shadow-2xl w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            {/* Modal header */}
            <div className="bg-[#0f5257] text-white px-8 py-6 flex items-center justify-between shrink-0">
              <div className="min-w-0">
                {selectedReg ? (
                  <>
                    <h2 className="text-2xl font-bold truncate">{selectedReg.full_name}</h2>
                    <p className="text-[#91E0CD] text-sm mt-1 truncate">
                      {(selectedReg.courses as any)?.[0]?.title || 'Unknown Course'} · Applied {new Date(selectedReg.created_at).toLocaleDateString()}
                    </p>
                  </>
                ) : (
                  <div className="space-y-2">
                    <div className="h-7 w-52 bg-white/10 animate-pulse rounded-lg" />
                    <div className="h-4 w-72 bg-white/10 animate-pulse rounded" />
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3 shrink-0 ml-4">
                {selectedReg && (
                  <>
                    <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border ${
                      selectedReg.status === 'Approved' || selectedReg.status === 'Paid'
                        ? 'bg-green-400/20 text-green-300 border-green-400/30'
                        : 'bg-yellow-400/20 text-yellow-300 border-yellow-400/30'
                    }`}>
                      {selectedReg.status}
                    </span>

                    <button
                      type="button"
                      onClick={() => printRegistrationPDF(selectedReg)}
                      disabled={printingPDF}
                      className="flex items-center gap-2 bg-[#07CAC3] text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-white hover:text-[#0f5257] transition-all disabled:opacity-60"
                    >
                      {printingPDF
                        ? <Loader2 size={16} className="animate-spin" />
                        : <Printer size={16} />}
                      {printingPDF ? 'Generating…' : 'Print Form'}
                    </button>
                  </>
                )}

                <button
                  type="button"
                  onClick={closeModal}
                  aria-label="Close"
                  className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Modal body */}
            <div className="flex-1 overflow-y-auto p-8">
              {loadingDetail ? (
                <div className="flex flex-col items-center justify-center py-24 gap-4">
                  <Loader2 className="animate-spin text-[#07CAC3] w-10 h-10" />
                  <p className="text-[#0f5257] font-bold">Loading registration details…</p>
                </div>
              ) : selectedReg ? (
                <div className="space-y-6">

                  {/* Row 1: Student + right column */}
                  <div className="grid md:grid-cols-2 gap-6">

                    {/* Student info */}
                    <InfoCard icon={<User size={18} />} title="Student Information">
                      <InfoField label="Full Name" value={selectedReg.full_name} />
                      <InfoField label="Date of Birth" value={selectedReg.date_of_birth ? new Date(selectedReg.date_of_birth).toLocaleDateString() : ''} />
                      <InfoField label="Gender" value={selectedReg.gender} />
                      <InfoField label="Nationality" value={selectedReg.nationality} />
                      <InfoField label="Address" value={selectedReg.address} />
                      <InfoField label="City" value={selectedReg.city} />
                      <InfoField label="Phone" value={selectedReg.student_phone} />
                      <InfoField label="Email" value={selectedReg.student_email} />
                    </InfoCard>

                    {/* Right column stacked cards */}
                    <div className="space-y-6">
                      <InfoCard icon={<Shield size={18} />} title="Guardian Information">
                        <InfoField label="Full Name" value={selectedReg.guardian_name} />
                        <InfoField label="Relationship" value={selectedReg.guardian_relationship} />
                        <InfoField label="Phone" value={selectedReg.guardian_phone} />
                      </InfoCard>

                      <InfoCard icon={<Heart size={18} />} title="Medical Information">
                        <InfoField label="Conditions" value={selectedReg.medical_conditions_details || 'None disclosed'} />
                        <InfoField label="Allergies" value={selectedReg.allergies || 'None disclosed'} />
                      </InfoCard>

                      <InfoCard icon={<CreditCard size={18} />} title="Payment Details">
                        <InfoField
                          label="Amount Paid"
                          value={selectedReg.amount_paid ? `KES ${parseInt(selectedReg.amount_paid).toLocaleString()}` : ''}
                        />
                        <InfoField label="M-Pesa Code" value={selectedReg.payment_reference} mono />
                        <InfoField label="Notes" value={selectedReg.notes} />
                      </InfoCard>
                    </div>
                  </div>

                  {/* Documents */}
                  <InfoCard icon={<FileText size={18} />} title="Uploaded Documents">
                    {selectedReg.documents.length > 0 ? (
                      <div className="grid md:grid-cols-2 gap-3">
                        {selectedReg.documents.map((docItem) => {
                          const label = DOC_TYPE_LABELS[docItem.document_type] || docItem.document_type;
                          const isReal = !docItem.file_path.startsWith('simulation://');
                          const isImage = /\.(jpg|jpeg|png|webp)$/i.test(docItem.file_path);
                          return (
                            <div
                              key={docItem.id}
                              className="flex items-center justify-between bg-gray-50 rounded-xl p-4 border border-gray-100 gap-4"
                            >
                              <div className="min-w-0">
                                <p className="font-bold text-[#0f5257] text-sm">{label}</p>
                                <p className={`text-xs mt-0.5 ${isReal ? 'text-green-600' : 'text-gray-400 italic'}`}>
                                  {isReal ? (isImage ? 'Image uploaded' : 'Document uploaded') : 'Upload pending'}
                                </p>
                              </div>
                              {isReal ? (
                                <a
                                  href={docItem.file_path}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-1.5 bg-[#07CAC3] text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-[#0f5257] transition-all shrink-0"
                                >
                                  <Eye size={14} /> View
                                </a>
                              ) : (
                                <span className="text-xs text-gray-300 italic shrink-0">Unavailable</span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="text-gray-400 italic text-sm">No documents recorded for this registration.</p>
                    )}
                  </InfoCard>

                  {/* Status management */}
                  <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex flex-wrap items-center gap-4">
                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest mr-2">Update Status:</p>
                    {['Approved', 'Paid', 'Pending', 'Rejected'].map(s => (
                      <button
                        type="button"
                        key={s}
                        onClick={() => handleUpdateStatus(selectedReg.id, s)}
                        className={`px-5 py-2 rounded-xl text-sm font-bold transition-all ${
                          selectedReg.status === s
                            ? 'bg-[#0f5257] text-white shadow-md'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>

                </div>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
