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
  return (
    <div className="space-y-6">
      {/* Basic Information */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
          <User className="h-5 w-5 mr-2 text-red-500" />
          Basic Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <ProfileItem icon={<User />} label="Name" value={`${myDetails.basic.user_fname} ${myDetails.basic.user_lname}`} />
          <ProfileItem icon={<Calendar />} label="Age" value={`${myDetails.basic.age} years`} />
          <ProfileItem icon={<User />} label="Gender" value={myDetails.basic.user_gender} />
          <ProfileItem icon={<Phone />} label="Mobile" value={myDetails.basic.user_mobile} />
          {myDetails.basic.user_phone && (
            <ProfileItem icon={<Phone />} label="Phone" value={myDetails.basic.user_phone} />
          )}
          <ProfileItem icon={<Mail />} label="Email" value={myDetails.basic.user_email} />
          <ProfileItem icon={<MapPin />} label="Address" value={myDetails.basic.user_address} />
          <ProfileItem icon={<Users />} label="Religion" value={myDetails.basic.rel_name} />
          <ProfileItem icon={<Users />} label="Caste" value={myDetails.basic.caste_name} />
          <ProfileItem icon={<MapPin />} label="Country" value={myDetails.basic.con_name} />
          <ProfileItem icon={<MapPin />} label="State" value={myDetails.basic.state_name} />
          <ProfileItem icon={<MapPin />} label="District" value={myDetails.basic.dist_name} />
          <ProfileItem icon={<MapPin />} label="Location" value={myDetails.basic.lpo_name} />
        </div>
      </div>

      {/* Physical & Personal Details */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
          <User className="h-5 w-5 mr-2 text-red-500" />
          Physical & Personal Details
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <ProfileItem icon={<User />} label="Height" value={myDetails.detailed.up_height ? `${myDetails.detailed.up_height} cm` : 'N/A'} />
          <ProfileItem icon={<User />} label="Weight" value={myDetails.detailed.up_weight ? `${myDetails.detailed.up_weight} kg` : 'N/A'} />
          <ProfileItem icon={<User />} label="Complexion" value={myDetails.detailed.up_complexion || 'N/A'} />
          <ProfileItem icon={<User />} label="Body Type" value={myDetails.detailed.up_body_type || 'N/A'} />
          <ProfileItem icon={<User />} label="Physical Status" value={myDetails.detailed.up_physical_status || 'N/A'} />
          <ProfileItem icon={<User />} label="Mother Tongue" value={myDetails.detailed.up_mother_tongue || 'N/A'} />
          <ProfileItem icon={<Users />} label="Marital Status" value={myDetails.detailed.up_marital_status || 'N/A'} />
          {myDetails.detailed.up_no_of_children && myDetails.detailed.up_no_of_children > 0 && (
            <ProfileItem icon={<Users />} label="No. of Children" value={myDetails.detailed.up_no_of_children.toString()} />
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
          <ProfileItem icon={<GraduationCap />} label="Qualification Level" value={myDetails.detailed.up_qualification_level || 'N/A'} />
          <ProfileItem icon={<GraduationCap />} label="Qualification" value={myDetails.detailed.up_qualification || 'N/A'} />
          <ProfileItem icon={<GraduationCap />} label="Specialization" value={myDetails.detailed.up_specialization || 'N/A'} />
          <ProfileItem icon={<Briefcase />} label="Profession" value={myDetails.detailed.up_profession || 'N/A'} />
          <ProfileItem icon={<Briefcase />} label="Job Status" value={myDetails.detailed.up_job_status || 'N/A'} />
          <ProfileItem icon={<Briefcase />} label="Annual Income" value={myDetails.detailed.up_annual_income ? `₹${myDetails.detailed.up_annual_income}` : 'N/A'} />
          {myDetails.detailed.up_company_name && (
            <ProfileItem icon={<Briefcase />} label="Company" value={myDetails.detailed.up_company_name} />
          )}
          {myDetails.detailed.up_company_address && (
            <ProfileItem icon={<MapPin />} label="Company Address" value={myDetails.detailed.up_company_address} />
          )}
          {myDetails.detailed.up_about_profession && (
            <div className="md:col-span-2 lg:col-span-3">
              <ProfileItem icon={<Briefcase />} label="About Profession" value={myDetails.detailed.up_about_profession} />
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
          <ProfileItem icon={<Users />} label="Family Type" value={myDetails.detailed.up_family_type || 'N/A'} />
          <ProfileItem icon={<Users />} label="Family Status" value={myDetails.detailed.up_family_status || 'N/A'} />
          <ProfileItem icon={<Users />} label="Family Values" value={myDetails.detailed.up_family_values || 'N/A'} />
          <ProfileItem icon={<Briefcase />} label="Father's Occupation" value={myDetails.detailed.up_father_occupation || 'N/A'} />
          <ProfileItem icon={<Briefcase />} label="Mother's Occupation" value={myDetails.detailed.up_mother_occupation || 'N/A'} />
          <ProfileItem icon={<Users />} label="Brothers" value={(myDetails.detailed.up_no_of_brothers ?? 0).toString()} />
          <ProfileItem icon={<Users />} label="Sisters" value={(myDetails.detailed.up_no_of_sisters ?? 0).toString()} />
          {myDetails.detailed.up_about_family && (
            <div className="md:col-span-2 lg:col-span-3">
              <ProfileItem icon={<Users />} label="About Family" value={myDetails.detailed.up_about_family} />
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
          {myDetails.detailed.up_hobbies && (
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-600 mb-1 flex items-center">
                <Star className="h-4 w-4 mr-1 text-red-500" />
                Hobbies
              </p>
              <p className="text-sm font-medium text-gray-900">
                {Array.isArray(myDetails.detailed.up_hobbies)
                  ? myDetails.detailed.up_hobbies.join(', ')
                  : myDetails.detailed.up_hobbies}
              </p>
            </div>
          )}
          {myDetails.detailed.up_music && (
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-600 mb-1 flex items-center">
                <Star className="h-4 w-4 mr-1 text-red-500" />
                Music
              </p>
              <p className="text-sm font-medium text-gray-900">
                {Array.isArray(myDetails.detailed.up_music)
                  ? myDetails.detailed.up_music.join(', ')
                  : myDetails.detailed.up_music}
              </p>
            </div>
          )}
          {myDetails.detailed.up_reads && (
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-600 mb-1 flex items-center">
                <Star className="h-4 w-4 mr-1 text-red-500" />
                Reading
              </p>
              <p className="text-sm font-medium text-gray-900">
                {Array.isArray(myDetails.detailed.up_reads)
                  ? myDetails.detailed.up_reads.join(', ')
                  : myDetails.detailed.up_reads}
              </p>
            </div>
          )}
          {myDetails.detailed.up_cuisine && (
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-600 mb-1 flex items-center">
                <Star className="h-4 w-4 mr-1 text-red-500" />
                Cuisine
              </p>
              <p className="text-sm font-medium text-gray-900">
                {Array.isArray(myDetails.detailed.up_cuisine)
                  ? myDetails.detailed.up_cuisine.join(', ')
                  : myDetails.detailed.up_cuisine}
              </p>
            </div>
          )}
          {myDetails.detailed.up_diet && (
            <ProfileItem icon={<Star />} label="Diet" value={myDetails.detailed.up_diet} />
          )}
          {myDetails.detailed.up_drink && (
            <ProfileItem icon={<Star />} label="Drinking" value={myDetails.detailed.up_drink} />
          )}
          {myDetails.detailed.up_smoke && (
            <ProfileItem icon={<Star />} label="Smoking" value={myDetails.detailed.up_smoke} />
          )}
        </div>
      </div>

      {/* About Myself */}
      {myDetails.detailed.up_about_myself && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <User className="h-5 w-5 mr-2 text-red-500" />
            About Myself
          </h2>
          <p className="text-gray-700 leading-relaxed">{myDetails.detailed.up_about_myself}</p>
        </div>
      )}
    </div>
  );
});

MyProfileSection.displayName = 'MyProfileSection';

export default MyProfileSection;
