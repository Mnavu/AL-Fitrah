"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { useState } from "react";
import { Calendar as CalendarIcon } from "lucide-react";

// --- Zod Schema for Validation ---
const registrationSchema = z.object({
  full_name: z.string().min(1, "Full name is required"),
  date_of_birth: z.date().optional(),
  place_of_birth: z.string().optional(),
  gender: z.string().optional(),
  nationality: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  postal_code: z.string().optional(),
  student_phone: z.string().optional(),
  student_email: z.string().email("Invalid email address"),
  
  father_name: z.string().optional(),
  father_occupation: z.string().optional(),
  father_phone: z.string().optional(),
  mother_name: z.string().optional(),
  mother_occupation: z.string().optional(),
  mother_phone: z.string().optional(),
  guardian_name: z.string().optional(),
  guardian_relationship: z.string().optional(),
  guardian_phone: z.string().optional(),

  emergency_contact_name: z.string().min(1, "Emergency contact name is required"),
  emergency_contact_relationship: z.string().optional(),
  emergency_contact_phone: z.string().min(1, "Emergency contact number is required"),

  has_medical_conditions: z.boolean().default(false),
  medical_conditions_details: z.string().optional(),
  allergies: z.string().optional(),
  
  how_did_you_hear: z.string().optional(),
  declaration: z.boolean().refine(val => val === true, "You must agree to the declaration"),
});

type RegistrationFormInputs = z.infer<typeof registrationSchema>;

// --- UI Components ---
const Card = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="bg-white p-6 rounded-lg shadow-md mb-8">
    <h2 className="text-2xl font-serif text-primary mb-6 border-b pb-4">{title}</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {children}
    </div>
  </div>
);

const Input = ({ name, label, register, error, ...props }: any) => (
  <div className={props.className}>
    <label htmlFor={name} className="block text-primary text-sm font-bold mb-2">{label}</label>
    <input id={name} {...register(name)} {...props} className={`shadow appearance-none border rounded w-full py-2 px-3 text-primary leading-tight focus:outline-none focus:shadow-outline focus:border-primary ${error ? 'border-red-500' : ''}`} />
    {error && <p className="text-red-500 text-xs italic mt-1">{error.message}</p>}
  </div>
);

const Select = ({ name, label, options, register, error, ...props }: any) => (
    <div className={props.className}>
        <label htmlFor={name} className="block text-primary text-sm font-bold mb-2">{label}</label>
        <select id={name} {...register(name)} {...props} className={`shadow appearance-none border rounded w-full py-2 px-3 text-primary leading-tight focus:outline-none focus:shadow-outline focus:border-primary ${error ? 'border-red-500' : ''}`}>
            {options.map((option: any) => <option key={option.value} value={option.value}>{option.label}</option>)}
        </select>
        {error && <p className="text-red-500 text-xs italic mt-1">{error.message}</p>}
    </div>
);


const Textarea = ({ name, label, register, error, ...props }: any) => (
  <div className={props.className}>
    <label htmlFor={name} className="block text-primary text-sm font-bold mb-2">{label}</label>
    <textarea id={name} {...register(name)} {...props} className={`shadow appearance-none border rounded w-full py-2 px-3 text-primary leading-tight focus:outline-none focus:shadow-outline focus:border-primary ${error ? 'border-red-500' : ''}`} />
    {error && <p className="text-red-500 text-xs italic mt-1">{error.message}</p>}
  </div>
);

const Checkbox = ({ name, label, register, error, ...props }: any) => (
    <div className={`flex items-center ${props.className}`}>
        <input type="checkbox" id={name} {...register(name)} {...props} className="mr-2 h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded" />
        <label htmlFor={name} className="text-primary text-sm font-bold">{label}</label>
        {error && <p className="text-red-500 text-xs italic mt-1">{error.message}</p>}
    </div>
);


const PaymentModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void; }) => {
  if (!isOpen) return null;

  const handleReturnHome = () => {
    // Redirect to home page
    window.location.href = '/';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full relative transform transition-all duration-300 scale-95 animate-in fade-in-0 zoom-in-95">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Application Received Successfully!</h2>
        <p className="text-gray-600 mb-6 text-center">
          To complete your registration, please pay the required fee using the details below.
        </p>
        
        <div className="bg-gray-50 border border-gray-200 p-6 rounded-lg mb-6 receipt-style">
          <div className="flex justify-between items-center mb-4">
            <span className="text-gray-500">Bank/Network:</span>
            <span className="font-semibold text-gray-800">DTB / M-Pesa</span>
          </div>
          <div className="flex justify-between items-center mb-4">
            <span className="text-gray-500">Paybill Number:</span>
            <span className="font-mono font-bold text-lg text-gray-900 tracking-wider">516600</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-500">Account Number:</span>
            <span className="font-mono font-bold text-lg text-gray-900 tracking-wider">103236Amina</span>
          </div>
        </div>
        
        <div className="flex justify-center">
          <button 
            onClick={handleReturnHome} 
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg focus:outline-none focus:shadow-outline transition duration-300"
          >
            Return to Home
          </button>
        </div>
      </div>
    </div>
  );
};


// --- Main Registration Page Component ---
export default function RegisterPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const { register, handleSubmit, control, watch, formState: { errors, isSubmitting } } = useForm<RegistrationFormInputs>({
    resolver: zodResolver(registrationSchema),
  });

  const hasMedicalConditions = watch("has_medical_conditions");

  const onSubmit = async (data: RegistrationFormInputs) => {
    try {
      const { error } = await supabase.from("registrations").insert(data);

      if (error) {
        throw error;
      }

      toast.success("Registration Successful!", {
        description: "Your admission form has been submitted.",
      });
      setIsModalOpen(true);
    } catch (err: any) {
      toast.error("Registration Failed", {
        description: err.message || "Please try again later.",
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-16 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-serif text-primary text-center mb-12">
          Student Admission Form (2026-2027)
        </h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          
          <Card title="Personal Student Information">
            <Input name="full_name" label="Full Name" register={register} error={errors.full_name} className="md:col-span-2" />
            
            <Controller
                name="date_of_birth"
                control={control}
                render={({ field }) => (
                    <div>
                        <label htmlFor="date_of_birth" className="block text-primary text-sm font-bold mb-2">Date of Birth</label>
                        <input
                            type="date"
                            id="date_of_birth"
                            onChange={(e) => field.onChange(e.target.valueAsDate)}
                            className={`shadow appearance-none border rounded w-full py-2 px-3 text-primary leading-tight focus:outline-none focus:shadow-outline focus:border-primary ${errors.date_of_birth ? 'border-red-500' : ''}`}
                        />
                        {errors.date_of_birth && <p className="text-red-500 text-xs italic mt-1">{errors.date_of_birth.message}</p>}
                    </div>
                )}
            />

            <Input name="place_of_birth" label="Place of Birth" register={register} error={errors.place_of_birth} />
            <Select name="gender" label="Gender" register={register} error={errors.gender} options={[{value: '', label: 'Select Gender'}, {value: 'Male', label: 'Male'}, {value: 'Female', label: 'Female'}]} />
            <Input name="nationality" label="Nationality" register={register} error={errors.nationality} />
            <Input name="address" label="Address" register={register} error={errors.address} className="md:col-span-2" />
            <Input name="city" label="City" register={register} error={errors.city} />
            <Input name="postal_code" label="Postal Code" register={register} error={errors.postal_code} />
            <Input name="student_phone" label="Student Phone" register={register} error={errors.student_phone} />
            <Input name="student_email" label="Student Email" type="email" register={register} error={errors.student_email} />
          </Card>

          <Card title="Parent/Guardian Information">
            <Input name="father_name" label="Father's Name" register={register} error={errors.father_name} />
            <Input name="father_occupation" label="Father's Occupation" register={register} error={errors.father_occupation} />
            <Input name="father_phone" label="Father's Phone" register={register} error={errors.father_phone} />
            <Input name="mother_name" label="Mother's Name" register={register} error={errors.mother_name} />
            <Input name="mother_occupation" label="Mother's Occupation" register={register} error={errors.mother_occupation} />
            <Input name="mother_phone" label="Mother's Phone" register={register} error={errors.mother_phone} />
            <Input name="guardian_name" label="Guardian's Name (Optional)" register={register} error={errors.guardian_name} />
            <Input name="guardian_relationship" label="Guardian's Relationship" register={register} error={errors.guardian_relationship} />
            <Input name="guardian_phone" label="Guardian's Phone" register={register} error={errors.guardian_phone} />
          </Card>

          <Card title="Emergency Contact">
            <Input name="emergency_contact_name" label="Full Name" register={register} error={errors.emergency_contact_name} />
            <Input name="emergency_contact_relationship" label="Relationship" register={register} error={errors.emergency_contact_relationship} />
            <Input name="emergency_contact_phone" label="Contact Number" register={register} error={errors.emergency_contact_phone} />
          </Card>
          
          <Card title="Medical Information">
            <Checkbox name="has_medical_conditions" label="Does the student have any medical conditions?" register={register} error={errors.has_medical_conditions} className="md:col-span-2"/>
            {hasMedicalConditions && (
                <Textarea name="medical_conditions_details" label="If yes, please specify details" register={register} error={errors.medical_conditions_details} className="md:col-span-2" />
            )}
            <Input name="allergies" label="Allergies (if any)" register={register} error={errors.allergies} className="md:col-span-2" />
          </Card>

          <Card title="Additional Information">
            <Select name="how_did_you_hear" label="How did you learn about our institution?" register={register} error={errors.how_did_you_hear} className="md:col-span-2"
                options={[
                    { value: '', label: 'Select an option' },
                    { value: 'Social Media', label: 'Social Media' },
                    { value: 'Friend', label: 'Friend' },
                    { value: 'Event', label: 'Event' },
                    { value: 'Other', label: 'Other' },
                ]}
            />
          </Card>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <Checkbox name="declaration" label="I declare that all information provided is true and accurate." register={register} error={errors.declaration} />
          </div>

          <div className="flex justify-end mt-8">
            <button
              type="submit"
              className="bg-primary hover:bg-secondary text-white font-bold py-3 px-8 rounded-full focus:outline-none focus:shadow-outline transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Application'}
            </button>
          </div>

        </form>
      </div>
      <PaymentModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
