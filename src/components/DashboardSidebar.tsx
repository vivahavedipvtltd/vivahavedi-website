'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  User,
  Image,
  FileText,
  Shield,
  Heart,
  MessageSquare,
  Eye,
  Star,
  Phone,
  Settings,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Search,
  Ban,
  Crown
} from 'lucide-react';

interface NavigationItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  count?: number;
}

interface NavigationGroup {
  title: string;
  icon: React.ReactNode;
  items: NavigationItem[];
}

interface DashboardSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  stats?: {
    profile_view?: number;
    profile_interest?: number;
    profile_chat?: number;
    profile_request?: number;
  };
}

const DashboardSidebar = ({ activeSection, onSectionChange, stats }: DashboardSidebarProps) => {
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const navigationGroups: NavigationGroup[] = [
    {
      title: 'Overview',
      icon: <LayoutDashboard className="h-6 w-6" />,
      items: [
        { id: 'overview', label: 'Dashboard', icon: <LayoutDashboard className="h-5 w-5" /> },
      ]
    },
    {
      title: 'Profile Management',
      icon: <User className="h-6 w-6" />,
      items: [
        { id: 'my-profile', label: 'My Profile', icon: <User className="h-5 w-5" /> },
        { id: 'my-photos', label: 'My Photos', icon: <Image className="h-5 w-5" /> },
        { id: 'my-documents', label: 'My Documents', icon: <FileText className="h-5 w-5" /> },
        { id: 'mobile-verification', label: 'Mobile Verification', icon: <Shield className="h-5 w-5" /> },
        { id: 'partner-preferences', label: 'Partner Preferences', icon: <Heart className="h-5 w-5" /> },
      ]
    },
    {
      title: 'Matching & Search',
      icon: <Search className="h-6 w-6" />,
      items: [
        { id: 'search', label: 'Search Profiles', icon: <Search className="h-5 w-5" /> },
        { id: 'matching-profiles', label: 'Matching Profiles', icon: <Heart className="h-5 w-5" /> },
        { id: 'saved-searches', label: 'Saved Searches', icon: <Star className="h-5 w-5" /> },
      ]
    },
    {
      title: 'Communications',
      icon: <MessageSquare className="h-6 w-6" />,
      items: [
        { id: 'interests', label: 'Interests', icon: <Heart className="h-5 w-5" />, count: stats?.profile_interest },
        { id: 'messages', label: 'Messages', icon: <MessageSquare className="h-5 w-5" />, count: stats?.profile_chat },
        { id: 'profile-views', label: 'Profile Views', icon: <Eye className="h-5 w-5" />, count: stats?.profile_view },
        { id: 'requests', label: 'Requests', icon: <Phone className="h-5 w-5" />, count: stats?.profile_request },
      ]
    },
    {
      title: 'My Activity',
      icon: <Eye className="h-6 w-6" />,
      items: [
        { id: 'shortlisted', label: 'Shortlisted', icon: <Star className="h-5 w-5" /> },
        { id: 'viewed-profiles', label: 'Viewed Profiles', icon: <Eye className="h-5 w-5" /> },
        { id: 'contacted', label: 'Contacted', icon: <Phone className="h-5 w-5" /> },
        { id: 'blocked-profiles', label: 'Blocked Profiles', icon: <Ban className="h-5 w-5" /> },
      ]
    },
    {
      title: 'Settings',
      icon: <Settings className="h-6 w-6" />,
      items: [
        { id: 'upgrade-plan', label: 'Upgrade Plan', icon: <Crown className="h-5 w-5" /> },
        { id: 'account-settings', label: 'Account Settings', icon: <Settings className="h-5 w-5" /> },
        { id: 'change-password', label: 'Change Password', icon: <Shield className="h-5 w-5" /> },
      ]
    }
  ];

  const handleItemClick = (itemId: string) => {
    setMobileOpen(false);

    // Direct navigation for pages that have their own routes
    switch (itemId) {
      case 'search':
        router.push('/search-results');
        break;
      case 'matching-profiles':
        router.push('/dashboard/matching-profiles');
        break;
      case 'saved-searches':
        router.push('/dashboard/saved-searches');
        break;
      case 'blocked-profiles':
        router.push('/dashboard/blocked-profiles');
        break;
      case 'upgrade-plan':
        router.push('/dashboard/settings/plan-upgrade');
        break;
      default:
        // For sections handled by dashboard page, navigate with section parameter
        router.push(`/dashboard?section=${itemId}`);
        break;
    }
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <h2 className="text-lg font-bold text-gray-900">Dashboard Menu</h2>
          )}
          {/* Desktop collapse button */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {collapsed ? (
              <ChevronRight className="h-5 w-5 text-gray-600" />
            ) : (
              <ChevronLeft className="h-5 w-5 text-gray-600" />
            )}
          </button>
          {/* Mobile close button */}
          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="h-5 w-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Navigation Groups */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        {collapsed ? (
          // Collapsed view: Show only group icons
          <div className="space-y-3">
            {navigationGroups.map((group, groupIndex) => {
              const isGroupActive = group.items.some(item => item.id === activeSection);
              return (
                <button
                  key={groupIndex}
                  onClick={() => handleItemClick(group.items[0].id)}
                  className={`w-full flex items-center justify-center p-3 rounded-lg transition-all duration-200 ${
                    isGroupActive
                      ? 'bg-red-500 text-white shadow-md'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  title={group.title}
                >
                  <span className={isGroupActive ? 'text-white' : 'text-gray-600'}>
                    {group.icon}
                  </span>
                </button>
              );
            })}
          </div>
        ) : (
          // Expanded view: Show all items
          navigationGroups.map((group, groupIndex) => (
            <div key={groupIndex}>
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                {group.title}
              </h3>
              <div className="space-y-1">
                {group.items.map((item) => {
                  const isActive = activeSection === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleItemClick(item.id)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all duration-200 ${
                        isActive
                          ? 'bg-red-500 text-white shadow-md'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={isActive ? 'text-white' : 'text-gray-600'}>
                          {item.icon}
                        </span>
                        <span className="font-medium text-sm">{item.label}</span>
                      </div>
                      {item.count !== undefined && item.count > 0 && (
                        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                          isActive
                            ? 'bg-white text-red-500'
                            : 'bg-red-100 text-red-600'
                        }`}>
                          {item.count}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="lg:hidden fixed bottom-4 right-4 z-50 bg-red-500 text-white p-4 rounded-full shadow-lg hover:bg-red-600 transition-colors"
      >
        {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:block bg-white border-r border-gray-200 transition-all duration-300 flex-shrink-0 ${
          collapsed ? 'w-20' : 'w-64'
        } h-full overflow-hidden`}
      >
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      <aside
        className={`lg:hidden fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <SidebarContent />
      </aside>
    </>
  );
};

export default DashboardSidebar;
