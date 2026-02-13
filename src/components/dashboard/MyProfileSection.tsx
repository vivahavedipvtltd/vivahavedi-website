import React from 'react';
import { formatHeight } from '@/utils/heightUtils';
import Link from 'next/link';
import {
  User,
  Users,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Briefcase,
  GraduationCap,
  Star,
  Edit2,
  Heart
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
      <div className="relative bg-gradient-to-br from-white via-white to-red-50 rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300">
        {/* Decorative corner */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-red-100 to-pink-100 rounded-bl-full opacity-20"></div>

        <div className="relative flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
              <User className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
                Basic Information
              </h2>
              <p className="text-xs text-gray-500">Personal & Contact Details</p>
            </div>
          </div>
          <Link
            href="/dashboard/profile/basic"
            className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200 group"
          >
            <Edit2 className="h-4 w-4 group-hover:rotate-12 transition-transform" />
            <span className="text-sm font-semibold">Edit</span>
          </Link>
        </div>

        <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
      <div className="relative bg-gradient-to-br from-white via-white to-blue-50 rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-bl-full opacity-20"></div>

        <div className="relative flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg">
              <Heart className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Physical & Personal Details
              </h2>
              <p className="text-xs text-gray-500">Physical Attributes & Personal Info</p>
            </div>
          </div>
          <Link
            href="/dashboard/profile/basic"
            className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200 group"
          >
            <Edit2 className="h-4 w-4 group-hover:rotate-12 transition-transform" />
            <span className="text-sm font-semibold">Edit</span>
          </Link>
        </div>

        <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <ProfileItem icon={<User />} label="Height" value={formatHeight(detailed.up_height)} />
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
      <div className="relative bg-gradient-to-br from-white via-white to-green-50 rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-100 to-emerald-100 rounded-bl-full opacity-20"></div>

        <div className="relative flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                Education & Career
              </h2>
              <p className="text-xs text-gray-500">Academic & Professional Details</p>
            </div>
          </div>
          <Link
            href="/dashboard/profile/education"
            className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200 group"
          >
            <Edit2 className="h-4 w-4 group-hover:rotate-12 transition-transform" />
            <span className="text-sm font-semibold">Edit</span>
          </Link>
        </div>

        <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
      <div className="relative bg-gradient-to-br from-white via-white to-purple-50 rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-100 to-pink-100 rounded-bl-full opacity-20"></div>

        <div className="relative flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
              <Users className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Family Details
              </h2>
              <p className="text-xs text-gray-500">Family Background & Information</p>
            </div>
          </div>
          <Link
            href="/dashboard/profile/family"
            className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200 group"
          >
            <Edit2 className="h-4 w-4 group-hover:rotate-12 transition-transform" />
            <span className="text-sm font-semibold">Edit</span>
          </Link>
        </div>

        <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
      <div className="relative bg-gradient-to-br from-white via-white to-yellow-50 rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-bl-full opacity-20"></div>

        <div className="relative flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
              <Star className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
                Hobbies & Interests
              </h2>
              <p className="text-xs text-gray-500">Personal Interests & Lifestyle</p>
            </div>
          </div>
          <Link
            href="/dashboard/profile/hobbies"
            className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200 group"
          >
            <Edit2 className="h-4 w-4 group-hover:rotate-12 transition-transform" />
            <span className="text-sm font-semibold">Edit</span>
          </Link>
        </div>

        <div className="relative grid grid-cols-1 md:grid-cols-2 gap-4">
          {detailed.up_hobbies && (
            <div className="p-4 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl border border-yellow-200 hover:border-yellow-300 transition-colors">
              <p className="text-xs text-gray-600 mb-2 flex items-center font-semibold">
                <Star className="h-4 w-4 mr-1 text-yellow-600" />
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
            <div className="p-4 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl border border-yellow-200 hover:border-yellow-300 transition-colors">
              <p className="text-xs text-gray-600 mb-2 flex items-center font-semibold">
                <Star className="h-4 w-4 mr-1 text-yellow-600" />
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
            <div className="p-4 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl border border-yellow-200 hover:border-yellow-300 transition-colors">
              <p className="text-xs text-gray-600 mb-2 flex items-center font-semibold">
                <Star className="h-4 w-4 mr-1 text-yellow-600" />
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
            <div className="p-4 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl border border-yellow-200 hover:border-yellow-300 transition-colors">
              <p className="text-xs text-gray-600 mb-2 flex items-center font-semibold">
                <Star className="h-4 w-4 mr-1 text-yellow-600" />
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
        <div className="relative bg-gradient-to-br from-white via-white to-indigo-50 rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-bl-full opacity-20"></div>

          <div className="relative flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
                <User className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  About Myself
                </h2>
                <p className="text-xs text-gray-500">Personal Description</p>
              </div>
            </div>
            <Link
              href="/dashboard/profile/about"
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200 group"
            >
              <Edit2 className="h-4 w-4 group-hover:rotate-12 transition-transform" />
              <span className="text-sm font-semibold">Edit</span>
            </Link>
          </div>

          <div className="relative p-6 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl border border-indigo-200">
            <p className="text-gray-700 leading-relaxed text-base">{detailed.up_about_myself}</p>
          </div>
        </div>
      )}
    </div>
  );
});

MyProfileSection.displayName = 'MyProfileSection';

export default MyProfileSection;
