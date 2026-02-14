import React from 'react';
import Link from 'next/link';
import { Users, Star, MapPin, GraduationCap, Heart, Edit2 } from 'lucide-react';
import ProfileItem from './ProfileItem';
import { PartnerProfile } from '@/types/dashboard';

interface PartnerPreferencesCardProps {
  partnerProfile: PartnerProfile | null;
}

const formatArrOrDash = (arr?: string[]): string => {
  if (!arr || arr.length === 0) return 'N/A';
  return arr.join(', ');
};

const formatHeightCm = (cm?: number | null): string => {
  if (!cm) return 'N/A';
  const totalInches = Math.round(cm / 2.54);
  const feet = Math.floor(totalInches / 12);
  const inches = totalInches % 12;
  return `${cm} cm (${feet}'${inches}")`;
};

const PartnerPreferencesCard: React.FC<PartnerPreferencesCardProps> = React.memo(({ partnerProfile }) => {
  const p = partnerProfile;

  const sectionCard = (
    gradientFrom: string,
    gradientTo: string,
    icon: React.ReactNode,
    title: string,
    subtitle: string,
    editHref: string,
    children: React.ReactNode
  ) => (
    <div className={`relative bg-gradient-to-br from-white via-white ${gradientTo} rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300`}>
      <div className={`absolute top-0 right-0 w-32 h-32 ${gradientFrom} rounded-bl-full opacity-20`}></div>

      <div className="relative flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className={`w-12 h-12 bg-gradient-to-br ${gradientFrom} rounded-xl flex items-center justify-center shadow-lg`}>
            {icon}
          </div>
          <div>
            <h2 className={`text-2xl font-bold bg-gradient-to-r ${gradientFrom} bg-clip-text text-transparent`}>
              {title}
            </h2>
            <p className="text-xs text-gray-500">{subtitle}</p>
          </div>
        </div>
        <Link
          href={editHref}
          className={`flex items-center space-x-2 px-4 py-2 bg-gradient-to-r ${gradientFrom} hover:opacity-90 text-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200 group`}
        >
          <Edit2 className="h-4 w-4 group-hover:rotate-12 transition-transform" />
          <span className="text-sm font-semibold">Edit</span>
        </Link>
      </div>

      <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {children}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Basic Preferences */}
      {sectionCard(
        'from-red-500 to-pink-500',
        'to-red-50',
        <Heart className="h-6 w-6 text-white" />,
        'Basic Preferences',
        'Age, Height & Personal',
        '/dashboard/profile/partner-basic',
        <>
          <ProfileItem icon={<Heart />} label="Age Range"
            value={p?.upp_age_f && p?.upp_age_t ? `${p.upp_age_f} – ${p.upp_age_t} years` : 'N/A'} />
          <ProfileItem icon={<Heart />} label="Height Range"
            value={p?.upp_height_f && p?.upp_height_t
              ? `${formatHeightCm(p.upp_height_f)} – ${formatHeightCm(p.upp_height_t)}`
              : 'N/A'} />
          <ProfileItem icon={<Users />} label="Marital Status"
            value={formatArrOrDash(p?.upp_m_status)} />
          <ProfileItem icon={<Users />} label="Body Type"
            value={formatArrOrDash(p?.upp_body_type)} />
          <ProfileItem icon={<Users />} label="Complexion"
            value={formatArrOrDash(p?.upp_complexion)} />
          <ProfileItem icon={<Users />} label="Physical Status"
            value={formatArrOrDash(p?.upp_physical_status)} />
          <ProfileItem icon={<Users />} label="Mother Tongue"
            value={formatArrOrDash(p?.upp_mother_tongue)} />
          <ProfileItem icon={<Users />} label="Residence Status"
            value={formatArrOrDash(p?.upp_res_status)} />
        </>
      )}

      {/* Religion & Caste */}
      {sectionCard(
        'from-yellow-500 to-orange-500',
        'to-yellow-50',
        <Star className="h-6 w-6 text-white" />,
        'Religion & Caste',
        'Spiritual Preferences',
        '/dashboard/profile/partner-religion',
        <>
          <ProfileItem icon={<Star />} label="Religion"
            value={formatArrOrDash(p?.religion)} />
          <ProfileItem icon={<Star />} label="Caste"
            value={formatArrOrDash(p?.caste)} />
          <ProfileItem icon={<Star />} label="Sub Caste"
            value={formatArrOrDash(p?.sub_caste)} />
          <ProfileItem icon={<Star />} label="Nakshatra"
            value={formatArrOrDash(p?.nakshatra)} />
        </>
      )}

      {/* Location Preferences */}
      {sectionCard(
        'from-blue-500 to-indigo-500',
        'to-blue-50',
        <MapPin className="h-6 w-6 text-white" />,
        'Location Preferences',
        'Country, State & District',
        '/dashboard/profile/partner-location',
        <>
          <ProfileItem icon={<MapPin />} label="Country"
            value={formatArrOrDash(p?.country)} />
          <ProfileItem icon={<MapPin />} label="State"
            value={formatArrOrDash(p?.state)} />
          <ProfileItem icon={<MapPin />} label="District"
            value={formatArrOrDash(p?.district)} />
        </>
      )}

      {/* Education & Career */}
      {sectionCard(
        'from-green-500 to-emerald-500',
        'to-green-50',
        <GraduationCap className="h-6 w-6 text-white" />,
        'Education & Career',
        'Qualification & Profession',
        '/dashboard/profile/partner-education',
        <>
          <ProfileItem icon={<GraduationCap />} label="Education Level"
            value={formatArrOrDash(p?.q_level)} />
          <ProfileItem icon={<GraduationCap />} label="Qualification"
            value={formatArrOrDash(p?.qualification)} />
          <ProfileItem icon={<GraduationCap />} label="Specialization"
            value={formatArrOrDash(p?.specialization)} />
          <ProfileItem icon={<GraduationCap />} label="Profession"
            value={formatArrOrDash(p?.profession)} />
        </>
      )}
    </div>
  );
});

PartnerPreferencesCard.displayName = 'PartnerPreferencesCard';

export default PartnerPreferencesCard;
