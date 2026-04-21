import { Home, FileText, Users, BarChart3, Bell, Settings } from 'lucide-react';

/**
 * Single source of truth for dashboard navigation.
 * - Sidebar renders every item.
 * - BottomNav renders only items where mobile === true.
 *
 * Analytics is excluded from mobile
 */
export const navItems = [
    { to: '/dashboard',               label: 'Home',          icon: Home,      mobile: true,  end: true  },
    { to: '/dashboard/quotes',        label: 'Quotes',        icon: FileText,  mobile: true,  end: false },
    { to: '/dashboard/customers',     label: 'Customers',     icon: Users,     mobile: true,  end: false },
    { to: '/dashboard/analytics',     label: 'Analytics',     icon: BarChart3, mobile: false, end: false },
    { to: '/dashboard/notifications', label: 'Notifications', icon: Bell,      mobile: true,  end: false },
    { to: '/dashboard/settings',      label: 'Settings',      icon: Settings,  mobile: true,  end: false },
];
