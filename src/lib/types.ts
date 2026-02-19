
// Define the Section interface
export interface Section {
  id: string;
  name: string;
  description: string | null;
  order: number;
  courses: Course[]; // Array of courses belonging to this section
}

// Update the Course interface to match the new schema
export interface Course {
  id: string;
  title: string;
  description: string | null;
  price: number | null; // Price is now nullable
  schedule: string | null; // New field
  instructor_name: string | null; // New field
  requires_registration: boolean; // New field
  section_id: string; // Foreign key to sections table
  created_at: string;
}
