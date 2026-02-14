import React from 'react';
import Link from 'next/link';
import { Star, MapPin, GraduationCap, Heart, Pencil, CheckCircle2, Clock3, Users, Edit2 } from 'lucide-react';
import ProfileItem from './ProfileItem';
import { PartnerProfile } from '@/types/dashboard';

interface PartnerPreferencesCardProps {
  partnerProfile: PartnerProfile | null;
  detailed?: boolean;
}

const sections = [
  {
    key: 'basic' as const,
    icon: Heart,
    title: 'Basic Preferences',
    subtitle: 'Age, Height & Personal',
    href: '/dashboard/profile/partner-basic',
    iconBg: 'bg-pink-50',
    iconColor: 'text-pink-500',
    accent: 'border-l-pink-400',
    gradient: 'from-red-500 to-pink-500',
    gradientBg: 'to-red-50',
  },
  {
    key: 'religion' as const,
    icon: Star,
    title: 'Religion & Caste',
    subtitle: 'Spiritual Preferences',
    href: '/dashboard/profile/partner-religion',
    iconBg: 'bg-orange-50',
    iconColor: 'text-orange-500',
    accent: 'border-l-orange-400',
    gradient: 'from-yellow-500 to-orange-500',
    gradientBg: 'to-yellow-50',
  },
  {
    key: 'location' as const,
    icon: MapPin,
    title: 'Location Preferences',
    subtitle: 'Country, State & District',
    href: '/dashboard/profile/partner-location',
    iconBg: 'bg-blue-50',
    iconColor: 'text-blue-500',
    accent: 'border-l-blue-400',
    gradient: 'from-blue-500 to-indigo-500',
    gradientBg: 'to-blue-50',
  },
  {
    key: 'education' as const,
    icon: GraduationCap,
    title: 'Education & Career',
    subtitle: 'Qualification & Profession',
    href: '/dashboard/profile/partner-education',
    iconBg: 'bg-emerald-50',
    iconColor: 'text-emerald-600',
    accent: 'border-l-emerald-400',
    gradient: 'from-green-500 to-emerald-500',
    gradientBg: 'to-green-50',
  },
] as const;

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

const PartnerPreferencesCard: React.FC<PartnerPreferencesCardProps> = React.memo(({ partnerProfile, detailed = false }) => {
  const p = partnerProfile;
  const completion = p?.completion;
  const completedCount = sections.filter(s => completion?.[s.key] === '1').length;

  /* ── Detailed view (partner-preferences section) ── */
  if (detailed) {
    return (
      <div className="space-y-6">
        {/* Basic Preferences */}
        <div className={`relative bg-gradient-to-br from-white via-white ${sections[0].gradientBg} rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300`}>
          <div className={`absolute top-0 right-0 w-32 h-32 ${sections[0].gradient} rounded-bl-full opacity-20`} />
          <div className="relative flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className={`w-12 h-12 bg-gradient-to-br ${sections[0].gradient} rounded-xl flex items-center justify-center shadow-lg`}>
                <Heart className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className={`text-2xl font-bold bg-gradient-to-r ${sections[0].gradient} bg-clip-text text-transparent`}>Basic Preferences</h2>
                <p className="text-xs text-gray-500">Age, Height &amp; Personal</p>
              </div>
            </div>
            <Link href="/dashboard/profile/partner-basic" className={`flex items-center space-x-2 px-4 py-2 bg-gradient-to-r ${sections[0].gradient} hover:opacity-90 text-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200 group`}>
              <Edit2 className="h-4 w-4 group-hover:rotate-12 transition-transform" />
              <span className="text-sm font-semibold">Edit</span>
            </Link>
          </div>
          <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <ProfileItem icon={<Heart />} label="Age Range" value={p?.upp_age_f && p?.upp_age_t ? `${p.upp_age_f} – ${p.upp_age_t} years` : 'N/A'} />
            <ProfileItem icon={<Heart />} label="Height Range" value={p?.upp_height_f && p?.upp_height_t ? `${formatHeightCm(p.upp_height_f)} – ${formatHeightCm(p.upp_height_t)}` : 'N/A'} />
            <ProfileItem icon={<Users />} label="Marital Status" value={formatArrOrDash(p?.upp_m_status)} />
            <ProfileItem icon={<Users />} label="Body Type" value={formatArrOrDash(p?.upp_body_type)} />
            <ProfileItem icon={<Users />} label="Complexion" value={formatArrOrDash(p?.upp_complexion)} />
            <ProfileItem icon={<Users />} label="Physical Status" value={formatArrOrDash(p?.upp_physical_status)} />
            <ProfileItem icon={<Users />} label="Mother Tongue" value={formatArrOrDash(p?.upp_mother_tongue)} />
            <ProfileItem icon={<Users />} label="Residence Status" value={formatArrOrDash(p?.upp_res_status)} />
          </div>
        </div>

        {/* Religion & Caste */}
        <div className={`relative bg-gradient-to-br from-white via-white ${sections[1].gradientBg} rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300`}>
          <div className={`absolute top-0 right-0 w-32 h-32 ${sections[1].gradient} rounded-bl-full opacity-20`} />
          <div className="relative flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className={`w-12 h-12 bg-gradient-to-br ${sections[1].gradient} rounded-xl flex items-center justify-center shadow-lg`}>
                <Star className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className={`text-2xl font-bold bg-gradient-to-r ${sections[1].gradient} bg-clip-text text-transparent`}>Religion &amp; Caste</h2>
                <p className="text-xs text-gray-500">Spiritual Preferences</p>
              </div>
            </div>
            <Link href="/dashboard/profile/partner-religion" className={`flex items-center space-x-2 px-4 py-2 bg-gradient-to-r ${sections[1].gradient} hover:opacity-90 text-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200 group`}>
              <Edit2 className="h-4 w-4 group-hover:rotate-12 transition-transform" />
              <span className="text-sm font-semibold">Edit</span>
            </Link>
          </div>
          <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <ProfileItem icon={<Star />} label="Religion" value={formatArrOrDash(p?.religion)} />
            <ProfileItem icon={<Star />} label="Caste" value={formatArrOrDash(p?.caste)} />
            <ProfileItem icon={<Star />} label="Sub Caste" value={formatArrOrDash(p?.sub_caste)} />
            <ProfileItem icon={<Star />} label="Nakshatra" value={formatArrOrDash(p?.nakshatra)} />
          </div>
        </div>

        {/* Location Preferences */}
        <div className={`relative bg-gradient-to-br from-white via-white ${sections[2].gradientBg} rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300`}>
          <div className={`absolute top-0 right-0 w-32 h-32 ${sections[2].gradient} rounded-bl-full opacity-20`} />
          <div className="relative flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className={`w-12 h-12 bg-gradient-to-br ${sections[2].gradient} rounded-xl flex items-center justify-center shadow-lg`}>
                <MapPin className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className={`text-2xl font-bold bg-gradient-to-r ${sections[2].gradient} bg-clip-text text-transparent`}>Location Preferences</h2>
                <p className="text-xs text-gray-500">Country, State &amp; District</p>
              </div>
            </div>
            <Link href="/dashboard/profile/partner-location" className={`flex items-center space-x-2 px-4 py-2 bg-gradient-to-r ${sections[2].gradient} hover:opacity-90 text-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200 group`}>
              <Edit2 className="h-4 w-4 group-hover:rotate-12 transition-transform" />
              <span className="text-sm font-semibold">Edit</span>
            </Link>
          </div>
          <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <ProfileItem icon={<MapPin />} label="Country" value={formatArrOrDash(p?.country)} />
            <ProfileItem icon={<MapPin />} label="State" value={formatArrOrDash(p?.state)} />
            <ProfileItem icon={<MapPin />} label="District" value={formatArrOrDash(p?.district)} />
          </div>
        </div>

        {/* Education & Career */}
        <div className={`relative bg-gradient-to-br from-white via-white ${sections[3].gradientBg} rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300`}>
          <div className={`absolute top-0 right-0 w-32 h-32 ${sections[3].gradient} rounded-bl-full opacity-20`} />
          <div className="relative flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className={`w-12 h-12 bg-gradient-to-br ${sections[3].gradient} rounded-xl flex items-center justify-center shadow-lg`}>
                <GraduationCap className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className={`text-2xl font-bold bg-gradient-to-r ${sections[3].gradient} bg-clip-text text-transparent`}>Education &amp; Career</h2>
                <p className="text-xs text-gray-500">Qualification &amp; Profession</p>
              </div>
            </div>
            <Link href="/dashboard/profile/partner-education" className={`flex items-center space-x-2 px-4 py-2 bg-gradient-to-r ${sections[3].gradient} hover:opacity-90 text-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200 group`}>
              <Edit2 className="h-4 w-4 group-hover:rotate-12 transition-transform" />
              <span className="text-sm font-semibold">Edit</span>
            </Link>
          </div>
          <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <ProfileItem icon={<GraduationCap />} label="Education Level" value={formatArrOrDash(p?.q_level)} />
            <ProfileItem icon={<GraduationCap />} label="Qualification" value={formatArrOrDash(p?.qualification)} />
            <ProfileItem icon={<GraduationCap />} label="Specialization" value={formatArrOrDash(p?.specialization)} />
            <ProfileItem icon={<GraduationCap />} label="Profession" value={formatArrOrDash(p?.profession)} />
          </div>
        </div>
      </div>
    );
  }

  /* ── Compact view (overview / dashboard) ── */
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <div>
          <h3 className="text-sm font-semibold text-gray-900 tracking-wide">Partner Preferences</h3>
          <p className="text-xs text-gray-400 mt-0.5">Manage what you&apos;re looking for</p>
        </div>
        <span className="text-xs font-medium text-gray-500 bg-gray-50 border border-gray-200 rounded-full px-3 py-1">
          {completedCount} / {sections.length} filled
        </span>
      </div>

      {/* Rows */}
      <div className="divide-y divide-gray-50">
        {sections.map(({ key, icon: Icon, title, subtitle, href, iconBg, iconColor, accent }) => {
          const done = completion?.[key] === '1';
          return (
            <div key={key} className={`flex items-center justify-between px-6 py-4 border-l-4 ${accent} hover:bg-gray-50/60 transition-colors duration-150`}>
              <div className="flex items-center gap-3.5">
                <div className={`w-9 h-9 rounded-xl ${iconBg} flex items-center justify-center shrink-0`}>
                  <Icon className={`h-4.5 w-4.5 ${iconColor}`} strokeWidth={1.8} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800 leading-tight">{title}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>
                </div>
              </div>
              <div className="flex items-center gap-2.5 shrink-0">
                {done ? (
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full px-2.5 py-1">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Completed
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-700 bg-amber-50 border border-amber-200 rounded-full px-2.5 py-1">
                    <Clock3 className="h-3.5 w-3.5" />
                    Pending
                  </span>
                )}
                <Link href={href} className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-red-600 border border-red-200 rounded-lg hover:bg-red-500 hover:text-white hover:border-red-500 transition-all duration-150">
                  <Pencil className="h-3 w-3" />
                  Edit
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
});

PartnerPreferencesCard.displayName = 'PartnerPreferencesCard';

export default PartnerPreferencesCard;
