-- Create the 'sections' table
CREATE TABLE sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  "order" INTEGER NOT NULL UNIQUE -- "order" is a reserved keyword, so it's quoted
);

-- Create the 'courses' table
CREATE TABLE courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  price NUMERIC(10, 2), -- Made nullable
  requires_registration BOOLEAN NOT NULL DEFAULT TRUE, -- New field
  section_id UUID REFERENCES sections(id) ON DELETE CASCADE, -- Link to sections, ON DELETE CASCADE
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create the 'registrations' table
CREATE TABLE registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  
  -- Student Information
  full_name TEXT NOT NULL,
  date_of_birth DATE,
  place_of_birth TEXT,
  gender TEXT,
  nationality TEXT,
  address TEXT,
  city TEXT,
  postal_code TEXT,
  student_phone TEXT,
  student_email TEXT NOT NULL,
  
  -- Parent/Guardian Information
  father_name TEXT,
  father_occupation TEXT,
  father_phone TEXT,
  mother_name TEXT,
  mother_occupation TEXT,
  mother_phone TEXT,
  guardian_name TEXT,
  guardian_relationship TEXT,
  guardian_phone TEXT,
  
  -- Emergency Contact
  emergency_contact_name TEXT NOT NULL,
  emergency_contact_relationship TEXT,
  emergency_contact_phone TEXT NOT NULL,
  
  -- Medical Information
  has_medical_conditions BOOLEAN,
  medical_conditions_details TEXT,
  allergies TEXT,
  
  -- Additional Information
  how_did_you_hear TEXT,
  
  -- Declaration
  declaration BOOLEAN NOT NULL,
  
  -- Course (mandatory link now)
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE, -- Made NOT NULL and ON DELETE CASCADE
  
  -- Status
  status TEXT DEFAULT 'Pending'
);
