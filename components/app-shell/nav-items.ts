import {
  LayoutDashboard,
  GitBranch,
  Trophy,
  Settings,
  type LucideIcon,
} from 'lucide-react';

export interface NavItem {
  id: string;
  href: string;
  icon: LucideIcon;
  label: string;
}

export const navItems: NavItem[] = [
  { id: 'overview', href: '/app/overview', icon: LayoutDashboard, label: 'Overview' },
  { id: 'repos', href: '/app/repos', icon: GitBranch, label: 'Repos' },
  { id: 'leaderboards', href: '/app/leaderboard', icon: Trophy, label: 'Leaderboards' },
  { id: 'settings', href: '/app/settings', icon: Settings, label: 'Settings' },
];
