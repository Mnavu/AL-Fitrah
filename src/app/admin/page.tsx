'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase'; // Adjust path if necessary
import { toast } from 'sonner';

interface Registration {
  id: string;
  created_at: string;
  student_name: string;
  email: string;
  phone: string;
  guardian_name?: string; // Add guardian_name
  guardian_phone?: string; // Add guardian_phone
  course_id: string;
  status: 'Pending' | 'Approved';
  courses: { title: string }; // Join with courses table
}

export default function AdminDashboard() {
  const router = useRouter();
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/login');
        return;
      }
      fetchRegistrations();
    };

    const fetchRegistrations = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('registrations')
          .select(`
            id,
            created_at,
            student_name,
            email,
            phone,
            guardian_name,
            guardian_phone,
            status,
            courses (title)
          `);

        if (error) {
          throw error;
        }

        setRegistrations(data || []);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch registrations.');
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, [router]);

  const handleMarkAsPaid = async (registrationId: string) => {
    try {
      const { error } = await supabase
        .from('registrations')
        .update({ status: 'Approved' })
        .eq('id', registrationId);

      if (error) {
        throw error;
      }

      setRegistrations((prevRegistrations) =>
        prevRegistrations.map((reg) =>
          reg.id === registrationId ? { ...reg, status: 'Approved' } : reg
        )
      );
      toast.success('Registration updated!', {
        description: 'Status changed to Approved.',
      });
    } catch (err: any) {
      toast.error('Failed to update status', {
        description: err.message || 'Please try again.',
      });
    }
  };

  if (loading) {
    return <div className="container mx-auto px-4 py-16 text-center text-primary">Loading dashboard...</div>;
  }

  if (error) {
    return <div className="container mx-auto px-4 py-16 text-center text-crimson">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-5xl font-serif text-primary text-center mb-12">Admin Dashboard</h1>

      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        {registrations.length > 0 ? (
          <table className="min-w-full divide-y divide-seafoam/30">
            <thead className="bg-secondary/15">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate uppercase tracking-wider">Student Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate uppercase tracking-wider">Course</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate uppercase tracking-wider">Phone</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate uppercase tracking-wider">Guardian Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate uppercase tracking-wider">Guardian Phone</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-seafoam/30">
              {registrations.map((reg) => (
                <tr key={reg.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-primary">
                    {new Date(reg.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-primary">{reg.student_name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-primary">{reg.courses?.title || 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-primary">{reg.phone}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-primary">{reg.guardian_name || 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-primary">{reg.guardian_phone || 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      reg.status === 'Approved' ? 'bg-seafoam/30 text-primary' : 'bg-accent/30 text-white'
                    }`}>
                      {reg.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {reg.status === 'Pending' && (
                      <button
                        onClick={() => handleMarkAsPaid(reg.id)}
                        className="bg-accent hover:bg-accent/90 text-white py-1 px-3 rounded text-xs transition duration-300"
                      >
                        Mark as Paid
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="p-8 text-center text-primary text-lg">No registrations found.</p>
        )}
      </div>
    </div>
  );
}
