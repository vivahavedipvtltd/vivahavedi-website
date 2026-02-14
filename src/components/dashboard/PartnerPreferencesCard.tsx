import React from 'react';
import Link from 'next/link';
import { Star, MapPin, GraduationCap, Heart, Pencil, CheckCircle2, Clock3 } from 'lucide-react';
import { PartnerProfile } from '@/types/dashboard';

interface PartnerPreferencesCardProps {
  partnerProfile: PartnerProfile | null;
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
  },
] as const;

const PartnerPreferencesCard: React.FC<PartnerPreferencesCardProps> = React.memo(({ partnerProfile }) => {
  const completion = partnerProfile?.completion;
  const completedCount = sections.filter(s => completion?.[s.key] === '1').length;

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
            <div
              key={key}
              className={`flex items-center justify-between px-6 py-4 border-l-4 ${accent} hover:bg-gray-50/60 transition-colors duration-150`}
            >
              {/* Left: icon + text */}
              <div className="flex items-center gap-3.5">
                <div className={`w-9 h-9 rounded-xl ${iconBg} flex items-center justify-center shrink-0`}>
                  <Icon className={`h-4.5 w-4.5 ${iconColor}`} strokeWidth={1.8} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800 leading-tight">{title}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>
                </div>
              </div>

              {/* Right: status + edit */}
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
                <Link
                  href={href}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-red-600 border border-red-200 rounded-lg hover:bg-red-500 hover:text-white hover:border-red-500 transition-all duration-150"
                >
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
