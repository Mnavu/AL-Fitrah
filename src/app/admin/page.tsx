'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { 
  Users, 
  MessageSquare, 
  Clock, 
  CheckCircle2, 
  Mail, 
  Phone as PhoneIcon, 
  Calendar,
  ChevronRight,
  Filter
} from 'lucide-react';

interface Registration {
  id: string;
  created_at: string;
  full_name: string; // Matches schema.sql
  student_email: string;
  student_phone: string;
  guardian_name?: string;
  guardian_phone?: string;
  course_id?: string;
  status: string;
  courses: { title: string }[];
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

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'registrations' | 'messages'>('registrations');
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch Registrations
      const { data: regData, error: regError } = await supabase
        .from('registrations')
        .select(`
          id,
          created_at,
          full_name,
          student_email,
          student_phone,
          guardian_name,
          guardian_phone,
          course_id,
          status,
          courses (title)
        `)
        .order('created_at', { ascending: false });

      if (regError) throw regError;
      setRegistrations((regData as any) || []);

      // Fetch Messages
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
      if (!session) {
        router.push('/login');
        return;
      }
      fetchData();
    };
    checkUser();
  }, [router]);

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('registrations')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;

      setRegistrations(prev => prev.map(reg => reg.id === id ? { ...reg, status: newStatus } : reg));
      toast.success(`Status updated to ${newStatus}`);
    } catch (err: any) {
      toast.error('Update Failed', { description: err.message });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F8FAFC]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#07CAC3] mb-4"></div>
        <p className="text-[#0f5257] font-bold">Loading Admin Portal...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20">
      {/* Admin Header */}
      <div className="bg-[#0f5257] text-white py-12 px-4 shadow-lg">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <h1 className="text-4xl font-serif font-bold mb-2">Management Portal</h1>
            <p className="text-[#91E0CD] font-medium">Overseeing Admissions & Inquiries</p>
          </div>
          <div className="flex bg-white/10 p-1 rounded-2xl backdrop-blur-md">
            <button 
              onClick={() => setActiveTab('registrations')}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${activeTab === 'registrations' ? 'bg-[#07CAC3] text-white shadow-lg' : 'text-white/70 hover:text-white'}`}
            >
              <Users size={20} /> Admissions ({registrations.length})
            </button>
            <button 
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
               <button onClick={fetchData} className="text-[#07CAC3] hover:text-[#0f5257] font-bold text-sm">Refresh List</button>
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
                                onClick={() => handleUpdateStatus(reg.id, 'Approved')}
                                className="bg-[#07CAC3] text-white p-2 rounded-lg hover:bg-[#0f5257] transition-all shadow-sm"
                                title="Approve Registration"
                              >
                                <CheckCircle2 size={16} />
                              </button>
                            )}
                            <button className="bg-gray-100 text-gray-600 p-2 rounded-lg hover:bg-gray-200 transition-all">
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
                      <p className="text-gray-700 leading-relaxed italic whitespace-pre-wrap">
                        {msg.message}
                      </p>
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
    </div>
  );
}

