'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { 
  Download, 
  AlertCircle, 
  Check, 
  Loader2, 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar, 
  ShieldAlert,
  CreditCard,
  Heart,
  FileText,
  Info,
  ChevronDown,
  ArrowLeft,
  Search,
  Upload
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import { Course } from '@/lib/types';
import { STATIC_ASSETS } from '@/lib/assets';

// Hardcoded M-Pesa details
const MPESA_PAYBILL = "516600";
const MPESA_ACCOUNT = "103236Amina";

const COUNTRY_CODES = [
  { code: '+254', country: 'Kenya', flag: '🇰🇪' },
  { code: '+255', country: 'Tanzania', flag: '🇹🇿' },
  { code: '+256', country: 'Uganda', flag: '🇺🇬' },
  { code: '+251', country: 'Ethiopia', flag: '🇪🇹' },
  { code: '+252', country: 'Somalia', flag: '🇸🇴' },
  { code: '+250', country: 'Rwanda', flag: '🇷🇼' },
  { code: '+257', country: 'Burundi', flag: '🇧🇮' },
  { code: '+258', country: 'Mozambique', flag: '🇲🇿' },
  { code: '+249', country: 'Sudan', flag: '🇸🇩' },
  { code: '+253', country: 'Djibouti', flag: '🇩🇯' },
  { code: '+966', country: 'Saudi Arabia', flag: '🇸🇦' },
  { code: '+971', country: 'UAE', flag: '🇦🇪' },
  { code: '+974', country: 'Qatar', flag: '🇶🇦' },
  { code: '+965', country: 'Kuwait', flag: '🇰🇼' },
  { code: '+973', country: 'Bahrain', flag: '🇧🇭' },
  { code: '+968', country: 'Oman', flag: '🇴🇲' },
  { code: '+962', country: 'Jordan', flag: '🇯🇴' },
  { code: '+961', country: 'Lebanon', flag: '🇱🇧' },
  { code: '+20', country: 'Egypt', flag: '🇪🇬' },
  { code: '+27', country: 'South Africa', flag: '🇿🇦' },
  { code: '+234', country: 'Nigeria', flag: '🇳🇬' },
  { code: '+233', country: 'Ghana', flag: '🇬🇭' },
  { code: '+212', country: 'Morocco', flag: '🇲🇦' },
  { code: '+216', country: 'Tunisia', flag: '🇹🇳' },
  { code: '+213', country: 'Algeria', flag: '🇩🇿' },
  { code: '+90', country: 'Turkey', flag: '🇹🇷' },
  { code: '+92', country: 'Pakistan', flag: '🇵🇰' },
  { code: '+91', country: 'India', flag: '🇮🇳' },
  { code: '+60', country: 'Malaysia', flag: '🇲🇾' },
  { code: '+62', country: 'Indonesia', flag: '🇮🇩' },
  { code: '+44', country: 'United Kingdom', flag: '🇬🇧' },
  { code: '+1', country: 'United States / Canada', flag: '🇺🇸' },
  { code: '+61', country: 'Australia', flag: '🇦🇺' },
  { code: '+49', country: 'Germany', flag: '🇩🇪' },
  { code: '+33', country: 'France', flag: '🇫🇷' },
  { code: '+31', country: 'Netherlands', flag: '🇳🇱' },
  { code: '+46', country: 'Sweden', flag: '🇸🇪' },
  { code: '+47', country: 'Norway', flag: '🇳🇴' },
  { code: '+45', country: 'Denmark', flag: '🇩🇰' },
];

// Removed "Completed Al-Fitrah Admission Application Form" as they fill it online
const REQUIRED_DOCS = [
  { id: 'birth_cert', label: 'Copy of Birth Certificate or National ID' },
  { id: 'parent_id', label: 'Copy of Parent/Guardian National ID' },
  { id: 'passport_photos', label: 'Two (2) recent passport-size photographs' },
  { id: 'school_report', label: 'Previous school report or learning background (if applicable)', optional: true },
  { id: 'medical_report', label: 'Medical report confirming fitness for boarding school life' },
  { id: 'emergency_info', label: 'Emergency contact information document' },
];

export default function RegistrationPage() {
  const { id } = useParams();
  const router = useRouter();
  
  // State
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [paymentStep, setPaymentStep] = useState<'form' | 'manual_payment' | 'success'>('form');
  const [transactionCode, setTransactionCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [uploadingDocs, setUploadingDocs] = useState<Record<string, boolean>>({});
  const [uploadedDocs, setUploadedDocs] = useState<Record<string, string>>({});

  // Form State
  const [formData, setFormData] = useState({
    full_name: '',
    date_of_birth: '',
    gender: '',
    nationality: '',
    address: '',
    city: '',
    phone: '',
    email: '',
    guardian_name: '',
    guardian_relationship: '',
    guardian_phone: '',
    guardian_phone_country_code: '+254',
    phone_country_code: '+254',
    medical_conditions: '',
    allergies: '',
    agreed: false
  });

  // Dynamic Payment State
  const [duration, setDuration] = useState(1);
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    async function fetchCourse() {
      try {
        setLoading(true);
        // Try to fetch by ID first, then by slug
        let query = supabase.from('courses').select('*');
        
        // Basic check if it's a UUID or a slug
        const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id as string);
        
        if (isUUID) {
          query = query.eq('id', id);
        } else {
          query = query.eq('slug', id);
        }

        const { data, error: fetchError } = await query.single();

        if (fetchError) throw fetchError;
        setCourse(data);
      } catch (err: any) {
        setError("Failed to load course details. Make sure you use a valid course link.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchCourse();
  }, [id]);

  // Handle calculation logic
  useEffect(() => {
    if (!course) return;

    // Use price from DB if available, otherwise default to logic
    const basePrice = course.price ? parseFloat(course.price.toString()) : 0;
    
    if (basePrice > 0) {
      setTotalAmount(basePrice * duration);
    } else {
      const isBoarding = course.title.toLowerCase().includes('boarding') || course.title.toLowerCase().includes('leadership');
      if (isBoarding) {
        // Apply specific term pricing
        if (duration === 4) setTotalAmount(210000);
        else if (duration === 8) setTotalAmount(420000);
        else if (duration === 12) setTotalAmount(630000);
        else setTotalAmount(70000 * duration);
      } else {
        setTotalAmount(0);
      }
    }
  }, [course, duration]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setFormData(prev => ({ ...prev, [name]: val }));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, docId: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("File size too large. Max 5MB allowed.");
      return;
    }

    setUploadingDocs(prev => ({ ...prev, [docId]: true }));
    
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${docId}_${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
      const filePath = `registrations/${fileName}`;

      // Uploading to Supabase Storage - accessible via the Supabase Dashboard "Storage" tab
      const { data, error: uploadError } = await supabase.storage
        .from('documents')
        .upload(filePath, file);

      if (uploadError) {
        console.warn("Storage upload failed, using simulation URL", uploadError);
        setUploadedDocs(prev => ({ ...prev, [docId]: `simulation://${filePath}` }));
      } else {
        const { data: { publicUrl } } = supabase.storage
          .from('documents')
          .getPublicUrl(filePath);
        setUploadedDocs(prev => ({ ...prev, [docId]: publicUrl }));
      }
    } catch (err: any) {
      console.error("Upload error:", err);
      alert("Failed to upload document. Please try again.");
    } finally {
      setUploadingDocs(prev => ({ ...prev, [docId]: false }));
    }
  };

  const validatePhone = (num: string) => {
    const clean = num.replace(/[\s\-\(\)]/g, '');
    return /^\d{6,15}$/.test(clean);
  };

  const generateReceipt = async (data: typeof formData, courseTitle: string, amount: number, period: string, code: string) => {
    const doc = new jsPDF();
    const date = new Date().toLocaleDateString();

    // BRAND COLOR CODES
    const midnight = [15, 82, 87]; // #0f5257
    const turquoise = [7, 202, 195]; // #07CAC3
    const lightTurquoise = [240, 253, 250]; // #f0fdfa

    // Background Accent for Header
    doc.setFillColor(lightTurquoise[0], lightTurquoise[1], lightTurquoise[2]);
    doc.rect(0, 0, 210, 55, 'F');
    
    // Vertical Accent Bar
    doc.setFillColor(turquoise[0], turquoise[1], turquoise[2]);
    doc.rect(0, 0, 4, 297, 'F');

    // 1. HEADER & LOGO
    // jsPDF renders PNG transparency as black, so we composite onto the header
    // background color first via an off-screen canvas before adding to the PDF.
    try {
      const img = new Image();
      img.src = STATIC_ASSETS.logoAlt;
      await new Promise((resolve) => {
        img.onload = resolve;
        img.onerror = resolve;
      });
      if (img.complete && img.naturalWidth !== 0) {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext('2d')!;
        // Fill with the header background first, then multiply-blend the logo
        // so its white background disappears into the teal header color.
        ctx.fillStyle = '#f0fdfa';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.globalCompositeOperation = 'multiply';
        ctx.drawImage(img, 0, 0);
        const logoDataUrl = canvas.toDataURL('image/jpeg', 1.0);
        doc.addImage(logoDataUrl, 'JPEG', 15, 12, 45, 20);
      }
    } catch (e) {
      console.error("Logo failed to load", e);
    }

    // Institute Name & Subtitle
    doc.setFontSize(22);
    doc.setTextColor(midnight[0], midnight[1], midnight[2]);
    doc.setFont('helvetica', 'bold');
    doc.text('AL-FITRAH', 195, 25, { align: 'right' });
    
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.setFont('helvetica', 'normal');
    doc.text('TRAINING INSTITUTE', 195, 31, { align: 'right' });
    
    doc.setFontSize(9);
    doc.setTextColor(turquoise[0], turquoise[1], turquoise[2]);
    doc.setFont('helvetica', 'bold');
    doc.text('OFFICIAL ENROLLMENT RECEIPT', 195, 37, { align: 'right' });

    // 2. MAIN CONTENT BOX
    doc.setDrawColor(240);
    doc.roundedRect(15, 65, 180, 185, 4, 4);

    // Metadata Row
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.setFont('helvetica', 'normal');
    doc.text('Date Issued:', 25, 78);
    doc.setTextColor(0);
    doc.text(date, 52, 78);

    doc.setTextColor(100);
    doc.text('Receipt No:', 125, 78);
    doc.setTextColor(midnight[0], midnight[1], midnight[2]);
    doc.setFont('helvetica', 'bold');
    doc.text(`ALF-${code}`, 150, 78);

    // Section 1: Student Details
    doc.setFillColor(turquoise[0], turquoise[1], turquoise[2]);
    doc.rect(25, 90, 160, 0.5, 'F');
    
    doc.setFontSize(12);
    doc.setTextColor(midnight[0], midnight[1], midnight[2]);
    doc.setFont('helvetica', 'bold');
    doc.text('STUDENT INFORMATION', 25, 100);
    
    doc.setFontSize(10);
    doc.setTextColor(0);
    doc.setFont('helvetica', 'normal');
    
    const detailsY = 112;
    const spacing = 9;
    
    doc.setTextColor(100); doc.text('Full Name:', 25, detailsY);
    doc.setTextColor(0); doc.text(data.full_name, 75, detailsY);
    
    doc.setTextColor(100); doc.text('Student Phone:', 25, detailsY + spacing);
    doc.setTextColor(0); doc.text(`${data.phone_country_code}${data.phone}`, 75, detailsY + spacing);
    
    doc.setTextColor(100); doc.text('Guardian Name:', 25, detailsY + spacing * 2);
    doc.setTextColor(0); doc.text(data.guardian_name, 75, detailsY + spacing * 2);
    
    doc.setTextColor(100); doc.text('Guardian Phone:', 25, detailsY + spacing * 3);
    doc.setTextColor(midnight[0], midnight[1], midnight[2]);
    doc.setFont('helvetica', 'bold');
    doc.text(`${data.guardian_phone_country_code}${data.guardian_phone}`, 75, detailsY + spacing * 3);
    doc.setFont('helvetica', 'normal');

    // Section 2: Enrollment Summary
    doc.setFillColor(turquoise[0], turquoise[1], turquoise[2]);
    doc.rect(25, 160, 160, 0.5, 'F');
    
    doc.setFontSize(12);
    doc.setTextColor(midnight[0], midnight[1], midnight[2]);
    doc.setFont('helvetica', 'bold');
    doc.text('ENROLLMENT & PAYMENT', 25, 170);
    
    doc.setFontSize(10);
    doc.setTextColor(0);
    doc.setFont('helvetica', 'normal');
    
    const payY = 182;
    doc.setTextColor(100); doc.text('Course Enrolled:', 25, payY);
    doc.setTextColor(0); doc.text(courseTitle, 75, payY);
    
    doc.setTextColor(100); doc.text('Payment Duration:', 25, payY + spacing);
    doc.setTextColor(0); doc.text(period, 75, payY + spacing);
    
    doc.setTextColor(100); doc.text('M-Pesa Trans. Code:', 25, payY + spacing * 2);
    doc.setTextColor(midnight[0], midnight[1], midnight[2]);
    doc.setFont('helvetica', 'bold');
    doc.text(code, 75, payY + spacing * 2);
    doc.setFont('helvetica', 'normal');

    // Total Amount Highlight Box
    doc.setFillColor(midnight[0], midnight[1], midnight[2]);
    doc.roundedRect(25, 215, 160, 22, 3, 3, 'F');
    doc.setTextColor(255);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('TOTAL AMOUNT PAID:', 35, 230);
    doc.setFontSize(18);
    doc.text(`KES ${amount.toLocaleString()}`, 175, 230, { align: 'right' });

    // 3. FOOTER
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.setFont('helvetica', 'italic');
    doc.text('This receipt is electronically generated and subject to M-Pesa transaction verification by administration.', 105, 265, { align: 'center' });
    doc.text('Al-Fitrah Training Institute | South C & Karen Campuses | Nairobi, Kenya', 105, 271, { align: 'center' });
    
    // Stamp Effect
    doc.setDrawColor(turquoise[0], turquoise[1], turquoise[2]);
    doc.setLineWidth(1.2);
    doc.circle(175, 265, 14);
    doc.setFontSize(7);
    doc.setTextColor(turquoise[0], turquoise[1], turquoise[2]);
    doc.setFont('helvetica', 'bold');
    doc.text('VERIFIED', 175, 264, { align: 'center' });
    doc.text('PAYMENT', 175, 269, { align: 'center' });

    doc.save(`Al-Fitrah_Receipt_${data.full_name.split(' ')[0]}.pdf`);
  };

  const handleInitialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.agreed) {
      setError("You must agree to the Fee Policy and Code of Conduct.");
      return;
    }

    if (!validatePhone(formData.phone)) {
      setError("Please enter a valid phone number (digits only, 6–15 digits, no country code prefix).");
      return;
    }

    // Check if required documents are uploaded (excluding optional ones)
    const missingDocs = REQUIRED_DOCS.filter(doc => !doc.optional && !uploadedDocs[doc.id]);
    if (missingDocs.length > 0) {
      setError(`Please upload all required documents: ${missingDocs.map(d => d.label).join(', ')}`);
      return;
    }

    setPaymentStep('manual_payment');
    window.scrollTo(0, 0);
  };

  const handleVerifySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (transactionCode.length !== 10) {
      setError("Standard M-Pesa transaction codes must be exactly 10 characters long.");
      return;
    }

    setSubmitting(true);

    try {
      const periodText = duration === 4 ? "1 Term (4 Months)" : duration === 8 ? "2 Terms (8 Months)" : duration === 12 ? "Full Year (3 Terms)" : `${duration} Month(s)`;
      
      // Saving all student info AND document URLs directly to the registrations table
      const { data: regData, error: regError } = await supabase
        .from('registrations')
        .insert([{
          full_name: formData.full_name,
          date_of_birth: formData.date_of_birth,
          gender: formData.gender,
          nationality: formData.nationality,
          address: formData.address,
          city: formData.city,
          student_phone: `${formData.phone_country_code}${formData.phone}`,
          student_email: formData.email,
          guardian_name: formData.guardian_name,
          guardian_relationship: formData.guardian_relationship,
          guardian_phone: `${formData.guardian_phone_country_code}${formData.guardian_phone}`,
          medical_conditions_details: formData.medical_conditions,
          allergies: formData.allergies,
          course_id: course?.id, // Use actual ID from course state
          status: 'Paid',
          amount_paid: totalAmount.toString(),
          payment_reference: transactionCode.toUpperCase(),
          // Storing documents in notes as well for extreme visibility
          notes: `Paid for ${periodText}. Documents: ${Object.keys(uploadedDocs).join(', ')}`,
          declaration: true,
          emergency_contact_name: formData.guardian_name,
          emergency_contact_phone: formData.guardian_phone
        }])
        .select()
        .single();

      if (regError) throw regError;

      // Now insert document metadata if possible
      if (regData && Object.keys(uploadedDocs).length > 0) {
        const docInserts = Object.entries(uploadedDocs).map(([type, path]) => ({
          registration_id: regData.id,
          document_type: type,
          file_path: path
        }));
        
        // This will only work if the table exists
        await supabase.from('student_documents').insert(docInserts);
      }

      // Notify Admin with the link to the registration
      await supabase.from('notifications').insert([{
        message: `New Admission: ${formData.full_name} (${course?.title}). Payment Verified: ${transactionCode.toUpperCase()}.`
      }]);

      setPaymentStep('success');
      generateReceipt(formData, course?.title || '', totalAmount, periodText, transactionCode.toUpperCase());

    } catch (err: any) {
      setError(err.message || "Final submission failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
      <Loader2 className="w-12 h-12 text-[#07CAC3] animate-spin" />
    </div>
  );

  const isBoarding = course?.title.toLowerCase().includes('boarding') || course?.title.toLowerCase().includes('leadership');
  const basePriceValue = isBoarding ? 70000 : parseInt(course?.price?.toString().replace(/[^\d]/g, '') || "0");

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-12 px-4">
      <div className="max-w-4xl mx-auto">
        
        {/* Progress Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-serif text-[#0f5257] font-bold mb-2">Student Admission Portal</h1>
          <p className="text-xl text-[#07CAC3] font-medium">{course?.title}</p>
        </div>

        {course?.is_enrollment_open === false ? (
          <div className="bg-white border-2 border-red-100 rounded-3xl p-10 text-center shadow-xl animate-in fade-in duration-500">
            <ShieldAlert className="w-20 h-20 text-red-500 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-red-600 mb-4">Enrollment Currently Closed</h2>
            <p className="text-gray-600 text-lg max-w-md mx-auto">
              {course?.enrollment_status_message || "We are currently at capacity for this program. Please check back later or contact us for waiting list options."}
            </p>
            <button onClick={() => router.back()} className="mt-8 bg-[#0f5257] text-white px-10 py-4 rounded-xl font-bold hover:bg-[#077B83] transition-all">
              Go Back
            </button>
          </div>
        ) : paymentStep === 'manual_payment' ? (
          <div className="animate-in slide-in-from-bottom-10 duration-700">
            {/* Payment Instructions Card */}
            <div className="bg-[#f0fdfa] border-2 border-[#07CAC3] rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative overflow-hidden mb-8">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#07CAC3] opacity-5 rounded-full -mr-32 -mt-32"></div>
              
              <button 
                onClick={() => setPaymentStep('form')}
                className="flex items-center gap-2 text-[#0f5257] font-bold hover:text-[#07CAC3] transition-colors mb-8"
              >
                <ArrowLeft size={20} /> Edit Details
              </button>

              <div className="flex items-center gap-4 mb-8">
                <div className="bg-[#07CAC3] p-3 rounded-2xl text-white">
                  <CreditCard size={32} />
                </div>
                <h2 className="text-3xl font-bold text-[#0f5257]">Complete Your Payment</h2>
              </div>

              <div className="space-y-8 bg-white p-8 rounded-3xl border border-[#07CAC3]/20 shadow-sm">
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-1">
                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Paybill Number</p>
                    <p className="text-3xl font-black text-[#0f5257]">{MPESA_PAYBILL}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Account Name</p>
                    <p className="text-3xl font-black text-[#0f5257]">{MPESA_ACCOUNT}</p>
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-100">
                  <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Amount to Pay</p>
                  <p className="text-5xl font-black text-[#0f5257]">KES {totalAmount.toLocaleString()}</p>
                </div>

                <div className="bg-[#f8fafc] p-6 rounded-2xl border border-gray-100">
                  <h4 className="font-bold text-[#0f5257] mb-4 flex items-center gap-2">
                    <Info size={18} className="text-[#07CAC3]" /> Instruction Steps:
                  </h4>
                  <ul className="space-y-3 text-sm font-medium text-gray-600">
                    <li className="flex gap-3"><span className="w-5 h-5 rounded-full bg-[#07CAC3] text-white flex items-center justify-center text-[10px] flex-shrink-0">1</span> Go to M-Pesa {'>'} Lipa na M-Pesa {'>'} Paybill</li>
                    <li className="flex gap-3"><span className="w-5 h-5 rounded-full bg-[#07CAC3] text-white flex items-center justify-center text-[10px] flex-shrink-0">2</span> Enter Business No: <span className="font-bold text-[#0f5257]">516600</span></li>
                    <li className="flex gap-3"><span className="w-5 h-5 rounded-full bg-[#07CAC3] text-white flex items-center justify-center text-[10px] flex-shrink-0">3</span> Enter Account No: <span className="font-bold text-[#0f5257]">103236Amina</span></li>
                    <li className="flex gap-3"><span className="w-5 h-5 rounded-full bg-[#07CAC3] text-white flex items-center justify-center text-[10px] flex-shrink-0">4</span> Enter Amount <span className="font-bold text-[#0f5257]">({totalAmount.toLocaleString()})</span> and your PIN</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Verification Form */}
            <div className="bg-white rounded-[2.5rem] p-10 shadow-xl border border-gray-100">
               {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-r-2xl flex items-center gap-4 mb-8">
                  <AlertCircle className="text-red-500" size={24} />
                  <p className="text-red-700 font-bold">{error}</p>
                </div>
              )}

              <form onSubmit={handleVerifySubmit} className="space-y-6">
                <div>
                  <label className="block text-xs font-black text-[#0f5257] uppercase tracking-widest mb-4">
                    Enter M-Pesa Transaction Code (e.g., QWF8...) *
                  </label>
                  <div className="relative">
                    <Search className="absolute left-6 top-6 text-gray-400 pointer-events-none" size={24} />
                    <input 
                      required
                      value={transactionCode}
                      onChange={(e) => setTransactionCode(e.target.value.toUpperCase())}
                      maxLength={10}
                      className="w-full pl-16 pr-8 py-6 rounded-2xl border-2 border-gray-50 bg-gray-50/50 focus:bg-white focus:border-[#07CAC3] outline-none transition-all text-2xl font-black tracking-[0.3em] text-[#0f5257] placeholder:text-gray-300 placeholder:tracking-normal"
                      placeholder="QWF8..."
                    />
                  </div>
                  <p className="mt-4 text-sm text-gray-400 font-medium">Exactly 10 characters as shown in your M-Pesa SMS.</p>
                </div>

                <button 
                  type="submit" 
                  disabled={submitting}
                  className="w-full bg-[#0f5257] text-white py-6 rounded-2xl font-black text-2xl flex items-center justify-center gap-4 hover:bg-[#077B83] disabled:opacity-50 transition-all shadow-xl"
                >
                  {submitting ? <Loader2 className="animate-spin" /> : <Check size={28} />}
                  Verify & Get Receipt
                </button>
              </form>
            </div>
          </div>
        ) : paymentStep === 'success' ? (
          <div className="bg-white rounded-[2.5rem] p-12 shadow-2xl text-center border-t-8 border-green-500 animate-in zoom-in duration-500">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8">
              <Check className="w-14 h-14 text-green-600" />
            </div>
            <h2 className="text-4xl font-bold text-[#0f5257] mb-4">Registration Complete!</h2>
            <p className="text-xl text-gray-600 mb-12 max-w-lg mx-auto">
              Your details and payment reference have been submitted for verification. Welcome to Al-Fitrah!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => generateReceipt(formData, course?.title || '', totalAmount, duration === 4 ? "1 Term (4 Months)" : duration === 8 ? "2 Terms (8 Months)" : duration === 12 ? "Full Year (3 Terms)" : `${duration} Month(s)`, transactionCode.toUpperCase())}
                className="flex items-center justify-center gap-2 bg-[#07CAC3] text-white px-10 py-5 rounded-2xl font-black text-lg hover:bg-[#0f5257] transition-all shadow-xl hover:shadow-2xl"
              >
                <Download size={22} /> Download Receipt
              </button>
              <button onClick={() => router.push('/')} className="bg-gray-100 text-[#0f5257] px-10 py-5 rounded-2xl font-bold text-lg hover:bg-gray-200 transition-all">
                Back to Home
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleInitialSubmit} className="space-y-10 pb-20">
            
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-r-2xl flex items-center gap-4 shadow-sm animate-shake">
                <AlertCircle className="text-red-500 flex-shrink-0" size={28} />
                <p className="text-red-700 font-bold">{error}</p>
              </div>
            )}

            {/* Section 1: Student Information */}
            <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-gray-100 group hover:shadow-md transition-all">
              <div className="flex items-center gap-4 mb-10 pb-4 border-b">
                <div className="bg-[#07CAC3]/10 p-3 rounded-2xl group-hover:bg-[#07CAC3]/20 transition-colors">
                  <User className="text-[#07CAC3] w-7 h-7" />
                </div>
                <h3 className="text-2xl font-bold text-[#0f5257]">Student Information</h3>
              </div>
              
              <div className="grid md:grid-cols-2 gap-x-10 gap-y-8">
                <div className="md:col-span-2">
                  <label className="block text-xs font-black text-[#0f5257] uppercase tracking-widest mb-3">Full Legal Name</label>
                  <input required name="full_name" value={formData.full_name} onChange={handleInputChange} className="w-full px-6 py-5 rounded-2xl border-2 border-gray-50 bg-gray-50/50 focus:bg-white focus:border-[#07CAC3] focus:ring-0 outline-none transition-all text-gray-700" placeholder="As it appears on ID or Passport" />
                </div>
                
                <div>
                  <label className="block text-xs font-black text-[#0f5257] uppercase tracking-widest mb-3">Date of Birth</label>
                  <div className="relative">
                    <Calendar className="absolute right-5 top-5 text-gray-400 w-5 h-5 pointer-events-none" />
                    <input required type="date" name="date_of_birth" value={formData.date_of_birth} onChange={handleInputChange} className="w-full px-6 py-5 rounded-2xl border-2 border-gray-50 bg-gray-50/50 focus:bg-white focus:border-[#07CAC3] outline-none transition-all" />
                  </div>
                </div>
                
                <div>
                  <label className="block text-xs font-black text-[#0f5257] uppercase tracking-widest mb-3">Gender</label>
                  <div className="relative">
                    <ChevronDown className="absolute right-5 top-5 text-gray-400 w-5 h-5 pointer-events-none" />
                    <select required name="gender" value={formData.gender} onChange={handleInputChange} className="w-full px-6 py-5 rounded-2xl border-2 border-gray-50 bg-gray-50/50 focus:bg-white focus:border-[#07CAC3] outline-none transition-all appearance-none cursor-pointer">
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black text-[#0f5257] uppercase tracking-widest mb-3">Nationality</label>
                  <input required name="nationality" value={formData.nationality} onChange={handleInputChange} className="w-full px-6 py-5 rounded-2xl border-2 border-gray-50 bg-gray-50/50 focus:bg-white focus:border-[#07CAC3] outline-none transition-all" placeholder="e.g. Kenyan" />
                </div>

                <div>
                  <label className="block text-xs font-black text-[#0f5257] uppercase tracking-widest mb-3">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute right-5 top-5 text-gray-400 w-5 h-5 pointer-events-none" />
                    <input required type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full px-6 py-5 rounded-2xl border-2 border-gray-50 bg-gray-50/50 focus:bg-white focus:border-[#07CAC3] outline-none transition-all" placeholder="email@example.com" />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-black text-[#0f5257] uppercase tracking-widest mb-3">Residential Address</label>
                  <div className="relative">
                    <MapPin className="absolute right-5 top-5 text-gray-400 w-5 h-5 pointer-events-none" />
                    <input required name="address" value={formData.address} onChange={handleInputChange} className="w-full px-6 py-5 rounded-2xl border-2 border-gray-50 bg-gray-50/50 focus:bg-white focus:border-[#07CAC3] outline-none transition-all" placeholder="Estate, Street, House Number" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black text-[#0f5257] uppercase tracking-widest mb-3">City / Town</label>
                  <input required name="city" value={formData.city} onChange={handleInputChange} className="w-full px-6 py-5 rounded-2xl border-2 border-gray-50 bg-gray-50/50 focus:bg-white focus:border-[#07CAC3] outline-none transition-all" />
                </div>

                <div>
                  <label className="block text-xs font-black text-[#0f5257] uppercase tracking-widest mb-3">Phone Number</label>
                  <div className="flex rounded-2xl border-2 border-gray-50 bg-gray-50/50 focus-within:bg-white focus-within:border-[#07CAC3] overflow-hidden transition-all">
                    <select
                      name="phone_country_code"
                      value={formData.phone_country_code}
                      onChange={handleInputChange}
                      aria-label="Phone country code"
                      className="bg-transparent border-r border-gray-200 px-3 py-5 outline-none font-bold text-[#0f5257] appearance-none cursor-pointer text-sm shrink-0"
                    >
                      {COUNTRY_CODES.map(c => (
                        <option key={c.code + c.country} value={c.code}>{c.flag} {c.code} {c.country}</option>
                      ))}
                    </select>
                    <input required name="phone" value={formData.phone} onChange={handleInputChange} className="flex-1 px-5 py-5 bg-transparent outline-none text-gray-700 min-w-0" placeholder="712 345 678" />
                    <Phone className="self-center mr-5 text-gray-400 w-5 h-5 pointer-events-none shrink-0" />
                  </div>
                  <p className="mt-2 text-xs text-gray-400 font-medium">Select your country code then enter your local number without the leading 0.</p>
                </div>
              </div>
            </div>

            {/* Section 2: Guardian Details */}
            <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-gray-100 group transition-all">
              <div className="flex items-center gap-4 mb-10 pb-4 border-b">
                <div className="bg-[#07CAC3]/10 p-3 rounded-2xl group-hover:bg-[#07CAC3]/20 transition-colors">
                  <ShieldAlert className="text-[#07CAC3] w-7 h-7" />
                </div>
                <h3 className="text-2xl font-bold text-[#0f5257]">Guardian Information</h3>
              </div>
              <div className="grid md:grid-cols-2 gap-x-10 gap-y-8">
                <div className="md:col-span-2">
                  <label className="block text-xs font-black text-[#0f5257] uppercase tracking-widest mb-3">Guardian Full Name</label>
                  <input required name="guardian_name" value={formData.guardian_name} onChange={handleInputChange} className="w-full px-6 py-5 rounded-2xl border-2 border-gray-50 bg-gray-50/50 focus:bg-white focus:border-[#07CAC3] outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-black text-[#0f5257] uppercase tracking-widest mb-3">Relationship</label>
                  <input required name="guardian_relationship" value={formData.guardian_relationship} onChange={handleInputChange} className="w-full px-6 py-5 rounded-2xl border-2 border-gray-50 bg-gray-50/50 focus:bg-white focus:border-[#07CAC3] outline-none transition-all" placeholder="e.g. Father" />
                </div>
                <div>
                  <label className="block text-xs font-black text-[#0f5257] uppercase tracking-widest mb-3">Guardian Phone</label>
                  <div className="flex rounded-2xl border-2 border-gray-50 bg-gray-50/50 focus-within:bg-white focus-within:border-[#07CAC3] overflow-hidden transition-all">
                    <select
                      name="guardian_phone_country_code"
                      value={formData.guardian_phone_country_code}
                      onChange={handleInputChange}
                      aria-label="Guardian phone country code"
                      className="bg-transparent border-r border-gray-200 px-3 py-5 outline-none font-bold text-[#0f5257] appearance-none cursor-pointer text-sm shrink-0"
                    >
                      {COUNTRY_CODES.map(c => (
                        <option key={c.code + c.country} value={c.code}>{c.flag} {c.code} {c.country}</option>
                      ))}
                    </select>
                    <input required name="guardian_phone" value={formData.guardian_phone} onChange={handleInputChange} className="flex-1 px-5 py-5 bg-transparent outline-none text-gray-700 min-w-0" placeholder="712 345 678" />
                    <Phone className="self-center mr-5 text-gray-400 w-5 h-5 pointer-events-none shrink-0" />
                  </div>
                  <p className="mt-2 text-xs text-gray-400 font-medium">Select country code then enter the local number without the leading 0.</p>
                </div>
              </div>
            </div>

            {/* Section 3: Medical Information */}
            <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-gray-100 group transition-all">
              <div className="flex items-center gap-4 mb-10 pb-4 border-b">
                <div className="bg-[#07CAC3]/10 p-3 rounded-2xl group-hover:bg-[#07CAC3]/20 transition-colors">
                  <Heart className="text-[#07CAC3] w-7 h-7" />
                </div>
                <h3 className="text-2xl font-bold text-[#0f5257]">Medical History (Optional)</h3>
              </div>
              <div className="space-y-8">
                <div>
                  <label className="block text-xs font-black text-[#0f5257] uppercase tracking-widest mb-3">Known Medical Conditions</label>
                  <textarea name="medical_conditions" value={formData.medical_conditions} onChange={handleInputChange} className="w-full px-6 py-5 rounded-2xl border-2 border-gray-50 bg-gray-50/50 focus:bg-white focus:border-[#07CAC3] outline-none transition-all h-28 resize-none" placeholder="Please list any chronic conditions..." />
                </div>
                <div>
                  <label className="block text-xs font-black text-[#0f5257] uppercase tracking-widest mb-3">Allergies (Food, Meds, etc.)</label>
                  <textarea name="allergies" value={formData.allergies} onChange={handleInputChange} className="w-full px-6 py-5 rounded-2xl border-2 border-gray-50 bg-gray-50/50 focus:bg-white focus:border-[#07CAC3] outline-none transition-all h-28 resize-none" placeholder="Please list all known allergies..." />
                </div>
              </div>
            </div>

            {/* Section 4: Document Uploads */}
            <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-gray-100 group transition-all">
              <div className="flex items-center gap-4 mb-10 pb-4 border-b">
                <div className="bg-[#07CAC3]/10 p-3 rounded-2xl group-hover:bg-[#07CAC3]/20 transition-colors">
                  <FileText className="text-[#07CAC3] w-7 h-7" />
                </div>
                <h3 className="text-2xl font-bold text-[#0f5257]">Required Document Uploads</h3>
              </div>
              <div className="grid md:grid-cols-1 gap-6">
                {REQUIRED_DOCS.map((doc) => (
                  <div key={doc.id} className="flex flex-col md:flex-row md:items-center justify-between p-6 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 hover:border-[#07CAC3] transition-all gap-4">
                    <div className="flex-1">
                      <p className="font-bold text-[#0f5257]">{doc.label} {doc.optional && <span className="text-xs text-gray-400 font-normal">(Optional)</span>} *</p>
                      <p className="text-xs text-gray-500 mt-1">PDF, JPG, or PNG (Max 5MB)</p>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      {uploadedDocs[doc.id] ? (
                        <div className="flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-xl font-bold text-sm">
                          <Check size={18} /> Uploaded
                        </div>
                      ) : (
                        <label className="cursor-pointer bg-white text-[#0f5257] border-2 border-[#0f5257] px-6 py-2 rounded-xl font-bold text-sm hover:bg-[#0f5257] hover:text-white transition-all flex items-center gap-2">
                          {uploadingDocs[doc.id] ? <Loader2 size={18} className="animate-spin" /> : <Upload size={18} />}
                          {uploadingDocs[doc.id] ? 'Uploading...' : 'Choose File'}
                          <input 
                            type="file" 
                            className="hidden" 
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={(e) => handleFileUpload(e, doc.id)}
                            disabled={uploadingDocs[doc.id]}
                          />
                        </label>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Section 5: Dynamic Payment Selection */}
            <div className="bg-white rounded-[2.5rem] p-10 shadow-xl border-2 border-[#07CAC3]/30">
                <div className="flex items-center gap-4 mb-10 pb-4 border-b border-gray-100">
                    <div className="bg-[#0f5257]/10 p-3 rounded-2xl">
                        <CreditCard className="text-[#0f5257] w-7 h-7" />
                    </div>
                    <h3 className="text-2xl font-bold text-[#0f5257]">Payment Period</h3>
                </div>

                <div className="bg-[#F8FAFC] p-8 rounded-3xl border border-gray-100 mb-8">
                    <label className="block text-xs font-black text-[#0f5257] uppercase tracking-widest mb-4">Select Duration to Pay For:</label>
                    <div className="relative">
                        <ChevronDown className="absolute right-5 top-5 text-gray-400 w-6 h-6 pointer-events-none" />
                        <select 
                            value={duration} 
                            onChange={(e) => setDuration(parseInt(e.target.value))}
                            className="w-full px-6 py-5 rounded-2xl border-2 border-gray-200 bg-white focus:border-[#07CAC3] outline-none transition-all appearance-none cursor-pointer font-bold text-lg text-[#0f5257]"
                        >
                            {isBoarding ? (
                                <>
                                    <option value={1}>1 Month (KES 70,000)</option>
                                    <option value={4}>1 Term - 4 Months (KES 210,000)</option>
                                    <option value={8}>2 Terms - 8 Months (KES 420,000)</option>
                                    <option value={12}>Full Year - 12 Months (KES 630,000)</option>
                                </>
                            ) : (
                                Array.from({length: 12}, (_, i) => i + 1).map(m => (
                                    <option key={m} value={m}>{m} {m === 1 ? 'Month' : 'Months'}</option>
                                ))
                            )}
                        </select>
                    </div>
                    
                    {!isBoarding ? (
                        <p className="mt-4 text-sm text-gray-500 font-medium italic">
                            Calculation: KES {basePriceValue.toLocaleString()} x {duration} {duration === 1 ? 'Month' : 'Months'} = <span className="text-[#07CAC3] font-bold">KES {totalAmount.toLocaleString()}</span>
                        </p>
                    ) : (
                        <p className="mt-4 text-sm text-gray-500 font-medium italic">
                            Total for {duration === 4 ? "1 Term" : duration === 8 ? "2 Terms" : duration === 12 ? "Full Year" : `${duration} Month(s)`}: <span className="text-[#07CAC3] font-bold">KES {totalAmount.toLocaleString()}</span>
                        </p>
                    )}
                </div>

                <div className="flex justify-between items-center px-4">
                    <span className="text-gray-500 font-bold uppercase tracking-widest text-sm">Grand Total:</span>
                    <span className="text-4xl font-black text-[#0f5257]">KES {totalAmount.toLocaleString()}</span>
                </div>
            </div>

            {/* Terms & Conditions Section */}
            <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <FileText className="text-[#07CAC3]" />
                <h3 className="text-xl font-bold text-[#0f5257]">Fee Policy & Code of Conduct</h3>
              </div>
              
              <div className="h-44 overflow-y-auto bg-gray-50/80 p-6 rounded-2xl border border-gray-100 text-sm text-gray-600 leading-relaxed mb-8 custom-scrollbar">
                {isBoarding ? (
                    <>
                        <p className="font-bold text-[#0f5257] mb-2 uppercase tracking-widest text-[10px]">Boarding Campus Rules:</p>
                        <ul className="list-disc pl-5 space-y-2 font-medium">
                            <li>All boarding fees are strictly payable in advance before the term begins.</li>
                            <li>There are no refunds for fees paid after the student has been admitted.</li>
                            <li>Strict Islamic discipline is expected; recurring violations may result in expulsion.</li>
                            <li>Mobile phones and tablets are strictly prohibited on campus.</li>
                            <li>Any medical conditions must be fully disclosed upon admission for student safety.</li>
                        </ul>
                    </>
                ) : (
                    <>
                        <p className="font-bold text-[#0f5257] mb-2 uppercase tracking-widest text-[10px]">Standard Campus Rules:</p>
                        <ul className="list-disc pl-5 space-y-2 font-medium">
                            <li>A one-time non-refundable Registration Fee of KES 1,000 is included.</li>
                            <li>Monthly tuition must be cleared by the 1st of every calendar month.</li>
                            <li>Tuition fees remain payable in full even if the student is absent.</li>
                            <li>A minimum of 1-month written notice is required before withdrawal from any course.</li>
                            <li>Punctuality and respect for instructors are core requirements.</li>
                        </ul>
                    </>
                )}
              </div>
              
              <label className="flex items-start gap-4 cursor-pointer group p-2">
                <input required type="checkbox" name="agreed" checked={formData.agreed} onChange={handleInputChange} className="mt-1 w-6 h-6 rounded border-gray-300 text-[#07CAC3] focus:ring-[#07CAC3]" />
                <span className="text-gray-600 font-bold group-hover:text-[#0f5257] transition-colors leading-snug">
                  I solemnly declare that the information provided is correct and I agree to the <span className="text-[#0f5257] underline">Fee Policy</span> and <span className="text-[#0f5257] underline">Code of Conduct</span>.
                </span>
              </label>
            </div>

            {/* Bottom Action Section */}
            <div className="bg-[#0f5257] rounded-[3rem] p-10 md:p-14 text-white shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-80 h-80 bg-[#07CAC3] opacity-10 rounded-full -mr-40 -mt-40"></div>
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-10">
                    <div className="text-center md:text-left">
                        <p className="text-[#91E0CD] font-black uppercase tracking-[0.2em] text-xs mb-3">Confirmation Summary</p>
                        <h4 className="text-5xl font-black mb-2">KES {totalAmount.toLocaleString()}</h4>
                        <p className="text-white/60 font-medium">Manual Paybill Verification</p>
                    </div>
                    
                    <button 
                        type="submit" 
                        disabled={submitting}
                        className="w-full md:w-auto bg-[#07CAC3] text-[#0f5257] py-6 px-16 rounded-[2rem] font-black text-2xl flex items-center justify-center gap-4 hover:bg-white hover:scale-105 active:scale-95 transition-all duration-300 shadow-[0_20px_50px_rgba(7,202,195,0.3)]"
                    >
                        Proceed to Payment <CreditCard size={28} />
                    </button>
                </div>
            </div>

          </form>
        )}
      </div>
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #f1f1f1; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #07CAC3; border-radius: 10px; }
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-5px); }
            75% { transform: translateX(5px); }
        }
        .animate-shake { animation: shake 0.2s ease-in-out 0s 2; }
      `}</style>
    </div>
  );
}
