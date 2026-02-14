'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  User,
  Image as ImageIcon,
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
    contact_requests_received?: number;
    contact_responses_received?: number;
  };
}

const DashboardSidebar = ({ activeSection, stats }: DashboardSidebarProps) => {
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
        { id: 'my-photos', label: 'My Photos', icon: <ImageIcon className="h-5 w-5" /> },
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
        {
          id: 'contacted',
          label: 'Contacted',
          icon: <Phone className="h-5 w-5" />,
          count: (stats?.contact_requests_received || 0) + (stats?.contact_responses_received || 0)
        },
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
        router.push('/search');
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
    <div className="flex flex-col h-full bg-gradient-to-b from-white to-gray-50">
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-pink-500 rounded-lg flex items-center justify-center shadow-lg">
                <LayoutDashboard className="h-4 w-4 text-white" />
              </div>
              <div>
                <h2 className="text-base font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
                  Dashboard
                </h2>
                <p className="text-[10px] text-gray-500">Navigation Menu</p>
              </div>
            </div>
          )}
          {/* Desktop collapse button */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex p-2 rounded-lg hover:bg-red-50 transition-all duration-200 group"
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4 text-gray-600 group-hover:text-red-500 transition-colors" />
            ) : (
              <ChevronLeft className="h-4 w-4 text-gray-600 group-hover:text-red-500 transition-colors" />
            )}
          </button>
          {/* Mobile close button */}
          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden p-2 rounded-lg hover:bg-red-50 transition-all duration-200 group"
          >
            <X className="h-4 w-4 text-gray-600 group-hover:text-red-500 transition-colors" />
          </button>
        </div>
      </div>

      {/* Navigation Groups */}
      <div className="flex-1 overflow-y-auto p-3 space-y-4 custom-scrollbar">
        {collapsed ? (
          // Collapsed view: Show only group icons
          <div className="space-y-1.5">
            {navigationGroups.map((group, groupIndex) => {
              const isGroupActive = group.items.some(item => item.id === activeSection);
              return (
                <div key={groupIndex} className="relative group/tooltip">
                  <button
                    onClick={() => handleItemClick(group.items[0].id)}
                    className={`w-full flex items-center justify-center p-2.5 rounded-lg transition-all duration-300 transform hover:scale-105 ${
                      isGroupActive
                        ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg shadow-red-500/50'
                        : 'text-gray-600 hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 hover:text-red-500'
                    }`}
                    title={group.title}
                  >
                    <span className={`transform transition-transform duration-200 ${isGroupActive ? 'scale-110' : ''}`}>
                      {group.icon}
                    </span>
                  </button>
                  {/* Tooltip */}
                  <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover/tooltip:opacity-100 pointer-events-none transition-opacity duration-200 whitespace-nowrap z-50">
                    {group.title}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          // Expanded view: Show all items
          navigationGroups.map((group, groupIndex) => (
            <div key={groupIndex} className="space-y-1.5">
              <div className="flex items-center space-x-2 px-2 mb-2">
                <div className="w-1 h-3 bg-gradient-to-b from-red-500 to-pink-500 rounded-full"></div>
                <h3 className="text-[10px] font-bold text-gray-700 uppercase tracking-wider">
                  {group.title}
                </h3>
              </div>
              <div className="space-y-1">
                {group.items.map((item) => {
                  const isActive = activeSection === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleItemClick(item.id)}
                      className={`group relative w-full flex items-center justify-between px-3 py-2 rounded-lg transition-all duration-300 transform ${
                        isActive
                          ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg shadow-red-500/30 scale-105'
                          : 'text-gray-700 hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 hover:text-red-600 hover:scale-102'
                      }`}
                    >
                      {/* Active indicator */}
                      {isActive && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-white rounded-r-full shadow-lg"></div>
                      )}

                      <div className="flex items-center gap-2.5">
                        <div className={`p-1.5 rounded-lg transition-all duration-300 ${
                          isActive
                            ? 'bg-white/20'
                            : 'bg-gray-100 group-hover:bg-red-100'
                        }`}>
                          <span className={`block transition-all duration-300 ${
                            isActive
                              ? 'text-white scale-110'
                              : 'text-gray-600 group-hover:text-red-500 group-hover:scale-110'
                          }`}>
                            {item.icon}
                          </span>
                        </div>
                        <span className={`font-semibold text-xs transition-all duration-300 ${
                          isActive ? 'text-white' : 'text-gray-700 group-hover:text-red-600'
                        }`}>
                          {item.label}
                        </span>
                      </div>

                      {/* Count badge */}
                      {item.count !== undefined && item.count > 0 && (
                        <span className={`flex items-center justify-center min-w-[20px] h-5 px-1.5 text-[10px] font-bold rounded-full transition-all duration-300 ${
                          isActive
                            ? 'bg-white text-red-500 shadow-md'
                            : 'bg-gradient-to-r from-red-500 to-pink-500 text-white group-hover:scale-110 group-hover:shadow-md'
                        }`}>
                          {item.count > 99 ? '99+' : item.count}
                        </span>
                      )}

                      {/* Hover arrow */}
                      {!isActive && (
                        <svg
                          className="w-3 h-3 text-red-500 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                        </svg>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer - User Profile Preview (Optional) */}
      {!collapsed && (
        <div className="p-3 border-t border-gray-100 bg-gradient-to-r from-red-50 to-pink-50">
          <div className="flex items-center space-x-2 px-2 py-1.5 rounded-lg bg-white shadow-sm">
            <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold shadow-md">
              <User className="h-4 w-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-gray-900 truncate">My Profile</p>
              <p className="text-[10px] text-gray-500">View & Edit</p>
            </div>
            <Settings className="h-3 w-3 text-gray-400" />
          </div>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="lg:hidden fixed bottom-5 right-5 z-50 bg-gradient-to-r from-red-500 to-pink-500 text-white p-3 rounded-xl shadow-2xl hover:shadow-red-500/50 hover:scale-110 transition-all duration-300 group"
      >
        {mobileOpen ? (
          <X className="h-5 w-5 transform group-hover:rotate-90 transition-transform duration-300" />
        ) : (
          <Menu className="h-5 w-5 transform group-hover:scale-110 transition-transform duration-300" />
        )}
      </button>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40 animate-fadeIn"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:block bg-white border-r border-gray-100 shadow-xl transition-all duration-300 flex-shrink-0 ${
          collapsed ? 'w-20' : 'w-72'
        } h-full overflow-hidden`}
      >
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      <aside
        className={`lg:hidden fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-gray-100 shadow-2xl transform transition-transform duration-300 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <SidebarContent />
      </aside>
    </>
  );
};

export default DashboardSidebar;
