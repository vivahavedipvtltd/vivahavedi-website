import React from 'react';
import {
  User,
  Users,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Briefcase,
  GraduationCap,
  Star
} from 'lucide-react';
import ProfileItem from './ProfileItem';
import { MyDetails } from '@/types/dashboard';

interface MyProfileSectionProps {
  myDetails: MyDetails;
}

const MyProfileSection: React.FC<MyProfileSectionProps> = React.memo(({ myDetails }) => {
  // Safe access to nested properties with defaults
  const basic = myDetails?.basic || {};
  const detailed = myDetails?.detailed || {};

  return (
    <div className="space-y-6">
      {/* Basic Information */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
          <User className="h-5 w-5 mr-2 text-red-500" />
          Basic Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <ProfileItem icon={<User />} label="Name" value={`${basic.user_fname || ''} ${basic.user_lname || ''}`} />
          <ProfileItem icon={<Calendar />} label="Age" value={basic.age ? `${basic.age} years` : 'N/A'} />
          <ProfileItem icon={<User />} label="Gender" value={basic.user_gender || 'N/A'} />
          <ProfileItem icon={<Phone />} label="Mobile" value={basic.user_mobile || 'N/A'} />
          {basic.user_phone && (
            <ProfileItem icon={<Phone />} label="Phone" value={basic.user_phone} />
          )}
          <ProfileItem icon={<Mail />} label="Email" value={basic.user_email || 'N/A'} />
          <ProfileItem icon={<MapPin />} label="Address" value={basic.user_address || 'N/A'} />
          <ProfileItem icon={<Users />} label="Religion" value={basic.rel_name || 'N/A'} />
          <ProfileItem icon={<Users />} label="Caste" value={basic.caste_name || 'N/A'} />
          <ProfileItem icon={<MapPin />} label="Country" value={basic.con_name || 'N/A'} />
          <ProfileItem icon={<MapPin />} label="State" value={basic.state_name || 'N/A'} />
          <ProfileItem icon={<MapPin />} label="District" value={basic.dist_name || 'N/A'} />
          <ProfileItem icon={<MapPin />} label="Location" value={basic.lpo_name || 'N/A'} />
        </div>
      </div>

      {/* Physical & Personal Details */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
          <User className="h-5 w-5 mr-2 text-red-500" />
          Physical & Personal Details
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <ProfileItem icon={<User />} label="Height" value={detailed.up_height ? `${detailed.up_height} cm` : 'N/A'} />
          <ProfileItem icon={<User />} label="Weight" value={detailed.up_weight ? `${detailed.up_weight} kg` : 'N/A'} />
          <ProfileItem icon={<User />} label="Complexion" value={detailed.up_complexion || 'N/A'} />
          <ProfileItem icon={<User />} label="Body Type" value={detailed.up_body_type || 'N/A'} />
          <ProfileItem icon={<User />} label="Physical Status" value={detailed.up_physical_status || 'N/A'} />
          <ProfileItem icon={<User />} label="Mother Tongue" value={detailed.up_mother_tongue || 'N/A'} />
          <ProfileItem icon={<Users />} label="Marital Status" value={detailed.up_marital_status || 'N/A'} />
          {detailed.up_no_of_children && detailed.up_no_of_children > 0 && (
            <ProfileItem icon={<Users />} label="No. of Children" value={detailed.up_no_of_children.toString()} />
          )}
        </div>
      </div>

      {/* Education & Career */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
          <GraduationCap className="h-5 w-5 mr-2 text-red-500" />
          Education & Career
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <ProfileItem icon={<GraduationCap />} label="Qualification Level" value={detailed.up_qualification_level || 'N/A'} />
          <ProfileItem icon={<GraduationCap />} label="Qualification" value={detailed.up_qualification || 'N/A'} />
          <ProfileItem icon={<GraduationCap />} label="Specialization" value={detailed.up_specialization || 'N/A'} />
          <ProfileItem icon={<Briefcase />} label="Profession" value={detailed.up_profession || 'N/A'} />
          <ProfileItem icon={<Briefcase />} label="Job Status" value={detailed.up_job_status || 'N/A'} />
          <ProfileItem icon={<Briefcase />} label="Annual Income" value={detailed.up_annual_income ? `₹${detailed.up_annual_income}` : 'N/A'} />
          {detailed.up_company_name && (
            <ProfileItem icon={<Briefcase />} label="Company" value={detailed.up_company_name} />
          )}
          {detailed.up_company_address && (
            <ProfileItem icon={<MapPin />} label="Company Address" value={detailed.up_company_address} />
          )}
          {detailed.up_about_profession && (
            <div className="md:col-span-2 lg:col-span-3">
              <ProfileItem icon={<Briefcase />} label="About Profession" value={detailed.up_about_profession} />
            </div>
          )}
        </div>
      </div>

      {/* Family Details */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
          <Users className="h-5 w-5 mr-2 text-red-500" />
          Family Details
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <ProfileItem icon={<Users />} label="Family Type" value={detailed.up_family_type || 'N/A'} />
          <ProfileItem icon={<Users />} label="Family Status" value={detailed.up_family_status || 'N/A'} />
          <ProfileItem icon={<Users />} label="Family Values" value={detailed.up_family_values || 'N/A'} />
          <ProfileItem icon={<Briefcase />} label="Father's Occupation" value={detailed.up_father_occupation || 'N/A'} />
          <ProfileItem icon={<Briefcase />} label="Mother's Occupation" value={detailed.up_mother_occupation || 'N/A'} />
          <ProfileItem icon={<Users />} label="Brothers" value={(detailed.up_no_of_brothers ?? 0).toString()} />
          <ProfileItem icon={<Users />} label="Sisters" value={(detailed.up_no_of_sisters ?? 0).toString()} />
          {detailed.up_about_family && (
            <div className="md:col-span-2 lg:col-span-3">
              <ProfileItem icon={<Users />} label="About Family" value={detailed.up_about_family} />
            </div>
          )}
        </div>
      </div>

      {/* Hobbies & Interests */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
          <Star className="h-5 w-5 mr-2 text-red-500" />
          Hobbies & Interests
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {detailed.up_hobbies && (
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-600 mb-1 flex items-center">
                <Star className="h-4 w-4 mr-1 text-red-500" />
                Hobbies
              </p>
              <p className="text-sm font-medium text-gray-900">
                {Array.isArray(detailed.up_hobbies)
                  ? detailed.up_hobbies.join(', ')
                  : detailed.up_hobbies}
              </p>
            </div>
          )}
          {detailed.up_music && (
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-600 mb-1 flex items-center">
                <Star className="h-4 w-4 mr-1 text-red-500" />
                Music
              </p>
              <p className="text-sm font-medium text-gray-900">
                {Array.isArray(detailed.up_music)
                  ? detailed.up_music.join(', ')
                  : detailed.up_music}
              </p>
            </div>
          )}
          {detailed.up_reads && (
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-600 mb-1 flex items-center">
                <Star className="h-4 w-4 mr-1 text-red-500" />
                Reading
              </p>
              <p className="text-sm font-medium text-gray-900">
                {Array.isArray(detailed.up_reads)
                  ? detailed.up_reads.join(', ')
                  : detailed.up_reads}
              </p>
            </div>
          )}
          {detailed.up_cuisine && (
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-600 mb-1 flex items-center">
                <Star className="h-4 w-4 mr-1 text-red-500" />
                Cuisine
              </p>
              <p className="text-sm font-medium text-gray-900">
                {Array.isArray(detailed.up_cuisine)
                  ? detailed.up_cuisine.join(', ')
                  : detailed.up_cuisine}
              </p>
            </div>
          )}
          {detailed.up_diet && (
            <ProfileItem icon={<Star />} label="Diet" value={detailed.up_diet} />
          )}
          {detailed.up_drink && (
            <ProfileItem icon={<Star />} label="Drinking" value={detailed.up_drink} />
          )}
          {detailed.up_smoke && (
            <ProfileItem icon={<Star />} label="Smoking" value={detailed.up_smoke} />
          )}
        </div>
      </div>

      {/* About Myself */}
      {detailed.up_about_myself && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <User className="h-5 w-5 mr-2 text-red-500" />
            About Myself
          </h2>
          <p className="text-gray-700 leading-relaxed">{detailed.up_about_myself}</p>
        </div>
      )}
    </div>
  );
});

MyProfileSection.displayName = 'MyProfileSection';

export default MyProfileSection;
