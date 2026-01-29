export interface MyDetails {
  basic: {
    user_id: number;
    user_fname: string;
    user_lname: string;
    user_gender: string;
    user_bday: number;
    user_bmonth: number;
    user_byear: number;
    age: number;
    user_mobile: string;
    user_phone?: string | null;
    user_email: string;
    user_address: string;
    user_email_verify: string;
    user_mobile_verify: string;
    user_hide?: string;
    rel_name: string;
    caste_name: string;
    con_name: string;
    state_name: string;
    dist_name: string;
    lpo_name: string;
  };
  detailed: {
    // Physical & Personal Details
    up_height?: string | null;
    up_weight?: string | null;
    up_body_weight?: string | null;
    up_complexion?: string | null;
    up_body_type?: string | null;
    up_physical_status?: string | null;
    up_mother_tongue?: string | null;
    up_marital_status?: string | null;
    up_no_of_children?: number | null;
    up_children?: number | null;
    up_personal_values?: string | null;

    // Education & Career
    up_qualification_level?: string | null;
    up_qualification?: string | null;
    up_specialization?: string | null;
    up_profession?: string | null;
    up_job_status?: string | null;
    up_annual_income?: string | null;
    up_annualincome?: string | null;
    up_income?: string | null;
    up_company_name?: string | null;
    up_company_address?: string | null;
    up_working_at?: string | null;
    up_about_profession?: string | null;
    up_working_as?: string | null;
    up_working_in?: string | null;
    up_workingin?: string | null;
    up_designation?: string | null;

    // Family Details
    up_family_type?: string | null;
    up_family_status?: string | null;
    up_family_values?: string | null;
    up_added_by?: string | null;
    up_native?: string | null;
    up_father_name?: string | null;
    up_father_occupation?: string | null;
    up_mother_name?: string | null;
    up_mother_occupation?: string | null;
    up_no_of_brothers?: number | null;
    up_brothers?: number | null;
    up_mbrothers?: number | null;
    up_no_of_sisters?: number | null;
    up_sisters?: number | null;
    up_msisters?: number | null;
    up_about_family?: string | null;

    // Hobbies & Interests
    up_hobbies?: string[] | string | null;
    up_music?: string[] | string | null;
    up_reads?: string[] | string | null;
    up_cuisine?: string[] | string | null;
    up_diet?: string | null;
    up_drink?: string | null;
    up_smoke?: string | null;
    up_about_myself?: string | null;

    // Completion flags
    up_complete?: string | null;
    up_education_complete?: string | null;
    up_family_complete?: string | null;
    up_hobbies_complete?: string | null;

    // IDs for relationships
    qual_id?: number | null;
    speci_id?: number | null;
    pro_id?: number | null;
    ql_id?: number | null;
    job_status?: string | null;
  };
  profile_completion: {
    registration: string; // '1' = complete, '0' = incomplete
    basic: string;        // '1' = complete, '0' = incomplete
    education: string;    // '1' = complete, '0' = incomplete
    family: string;       // '1' = complete, '0' = incomplete
    hobbies: string;      // '1' = complete, '0' = incomplete
    astro: string;        // '1' = complete, '0' = incomplete
    photo: string;        // '1' = complete, '0' = incomplete
    id_proof: string;     // '1' = complete, '0' = incomplete
    score: number;        // Overall completion percentage (0-100)
  };
}

export interface CommunicationStats {
  profile_view: number;
  profile_interest: number;
  profile_chat: number;
  profile_request: number;
}

export interface MyPlan {
  name: string;
  contact: string;
  chat: string;
  interest: string;
  message: string;
  expire: string;
  default: string;
}

export interface MyPhotos {
  photos: {
    [key: string]: string;
  };
  photo_status: string;
  photo_all_status: string;
  lock_status: string;
  id_proof: string;
  id_proof_status: string;
  horoscope: string;
  horoscope_status: string;
}

export interface CommunicationProfile {
  id: number;
  name: string;
  age: number;
  height: string;
  marital_status: string;
  religion: string;
  caste: string;
  district: string;
  qualification: string;
  photo: string;
  content?: string | null;
  status?: string | null;
  mobile?: string | null;
  phone?: string | null;
}

export type CommunicationViewType =
  | 'profile_viewed_by_me'
  | 'profile_viewed_to_me'
  | 'shortlised_by_me'
  | 'shortlised_to_me'
  | 'contacted_by_me'
  | 'contacted_to_me'
  | 'interested_by_me'
  | 'interested_to_me'
  | 'communication_statistics';

export interface PartnerProfile {
  completion: {
    basic: string;      // '1' = complete, '0' = incomplete
    religion: string;   // '1' = complete, '0' = incomplete
    location: string;   // '1' = complete, '0' = incomplete
    education: string;  // '1' = complete, '0' = incomplete
  };
  [key: string]: unknown; // Allow other fields from the API
}
