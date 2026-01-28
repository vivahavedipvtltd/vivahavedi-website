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
    up_height?: string;
    up_weight?: string;
    up_complexion?: string;
    up_body_type?: string;
    up_physical_status?: string;
    up_mother_tongue?: string;
    up_marital_status?: string;
    up_no_of_children?: number;
    up_qualification_level?: string;
    up_qualification?: string;
    up_specialization?: string;
    up_profession?: string;
    up_job_status?: string;
    up_annual_income?: string;
    up_company_name?: string;
    up_company_address?: string;
    up_about_profession?: string;
    up_family_type?: string;
    up_family_status?: string;
    up_family_values?: string;
    up_father_occupation?: string;
    up_mother_occupation?: string;
    up_no_of_brothers?: number;
    up_no_of_sisters?: number;
    up_about_family?: string;
    up_hobbies?: string[] | string;
    up_music?: string[] | string;
    up_reads?: string[] | string;
    up_cuisine?: string[] | string;
    up_diet?: string;
    up_drink?: string;
    up_smoke?: string;
    up_about_myself?: string;
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
