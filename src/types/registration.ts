export interface RegistrationFormData {
  // Step 1 - Basic Information
  mobile: string;
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
  last_name: string;
  gender: string;

  // Step 2 - Personal Details
  birth_day: number;
  birth_month: number;
  birth_year: number;
  religion: number;
  caste: number;

  // Step 3 - Location
  country: number;
  state: number;
  district: number;
  location: number;
  address: string;
}

export interface MasterData {
  religion: Array<{ id: number; name: string }>;
  caste: Array<{ id: number; name: string; masterId: number }>;
  country: Array<{ id: number; name: string }>;
  state: Array<{ id: number; name: string; masterId: number }>;
  district: Array<{ id: number; name: string; masterId: number }>;
  nakshathra: Array<{ id: number; name: string }>;
  qualification_level: Array<{ id: number; name: string }>;
  qualification: Array<{ id: number; name: string; masterId: number }>;
  specialization: Array<{ id: number; name: string }>;
  profession: Array<{ id: number; name: string }>;
  job_status: Array<{ id: number; name: string }>;
  manglik: Array<{ id: number; name: string }>;
  marital_status: Array<{ id: number; name: string }>;
  physical_status: Array<{ id: number; name: string }>;
  body_type: Array<{ id: number; name: string }>;
  complexion: Array<{ id: number; name: string }>;
  created: Array<{ id: number; name: string }>;
  mother_tongue: Array<{ id: number; name: string }>;
  personal_values: Array<{ id: number; name: string }>;
  hobbies: Array<{ id: number; name: string }>;
  favourite_cuisine: Array<{ id: number; name: string }>;
  favourite_music: Array<{ id: number; name: string }>;
  favourite_reads: Array<{ id: number; name: string }>;
  profile_report_reasons: Array<{ id: number; name: string }>;
}

export interface Location {
  id: number;
  name: string;
  masterId: number;
}
