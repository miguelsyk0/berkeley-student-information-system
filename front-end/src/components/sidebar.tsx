import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  GraduationCap,
  LayoutDashboard,
  School,
  UserSquare2,
  BookMarked,
  Upload,
  ClipboardList,
  FileDown,
  Settings,
  LogOut,
  X,
  ChevronDown,
  ChevronRight,
  type LucideIcon,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";

// ── Types ──────────────────────────────────────────────────────────────────────

export interface NavChild {
  label: string;
  href: string;
}

export interface NavItem {
  icon: LucideIcon;
  label: string;
  href: string;
  children?: NavChild[];
}

export interface SidebarUser {
  name: string;
  role: string;
  initials: string;
}

export interface SidebarProps {
  user?: SidebarUser;
  onLogout?: () => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

// ── Nav definition ─────────────────────────────────────────────────────────────

export const NAV_ITEMS: NavItem[] = [
  {
    icon: LayoutDashboard,
    label: "Dashboard",
    href: "/dashboard",
  },
  {
    icon: School,
    label: "School & Sections",
    href: "/school",
    children: [
      { label: "School Profile",     href: "/school/profile" },
      { label: "School Years",       href: "/school/years" },
      { label: "Sections",           href: "/school/sections" },
      { label: "Adviser Assignment", href: "/school/advisers" },
    ],
  },
  {
    icon: UserSquare2,
    label: "Students",
    href: "/students",
    children: [
      { label: "Student List",    href: "/students" },
      { label: "Enroll Student",  href: "/students/enroll" },
    ],
  },
  {
    icon: BookMarked,
    label: "Subjects",
    href: "/subjects",
  },
  {
    icon: Upload,
    label: "Grade Import",
    href: "/import",
    children: [
      { label: "Import Dashboard", href: "/import" },
      { label: "New Import",       href: "/import/new" },
      { label: "Import History",   href: "/import/history" },
    ],
  },
  {
    icon: ClipboardList,
    label: "Grade Encoding",
    href: "/grades",
    children: [
      { label: "Class Grade Sheet",  href: "/grades" },
      { label: "Student Grade View", href: "/grades/student" },
    ],
  },
  {
    icon: FileDown,
    label: "SF10 Generation",
    href: "/sf10",
  },
];

// ── Component ──────────────────────────────────────────────────────────────────

export default function Sidebar({ user: propUser, onLogout: propOnLogout, open: controlledOpen, onOpenChange }: SidebarProps) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { user: firebaseUser, logout } = useAuth();

  // Derive display info from Firebase user, fallback to props
  const displayName = firebaseUser?.displayName || firebaseUser?.email?.split("@")[0] || propUser?.name || "User";
  const displayRole = propUser?.role || "Registrar";
  const displayInitials = propUser?.initials || displayName.slice(0, 2).toUpperCase();

  async function handleLogout() {
    try {
      await logout();
      navigate("/login");
    } catch (err) {
      console.error("Logout failed", err);
    }
    propOnLogout?.();
  }

  // Sidebar open/collapsed state
  const [internalOpen, setInternalOpen] = useState(true);
  const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen;

  const [expandedItems, setExpandedItems] = useState<string[]>(() =>
    NAV_ITEMS
      .filter((item) =>
        item.children?.some((child) => pathname.startsWith(child.href)) ||
        pathname.startsWith(item.href)
      )
      .map((item) => item.href)
  );

  function handleToggleSidebar() {
    const next = !isOpen;
    setInternalOpen(next);
    onOpenChange?.(next);
  }

  function handleParentClick(item: NavItem) {
    if (item.children?.length) {
      setExpandedItems((prev) =>
        prev.includes(item.href)
          ? prev.filter((h) => h !== item.href)
          : [...prev, item.href]
      );
      if (!pathname.startsWith(item.href)) {
        navigate(item.children[0].href);
      }
    } else {
      navigate(item.href);
    }
  }

  function isParentActive(item: NavItem): boolean {
    if (item.children) return item.children.some((c) => pathname.startsWith(c.href));
    return pathname === item.href;
  }

  function isChildActive(href: string): boolean {
    return pathname === href || pathname.startsWith(href + "/");
  }

  return (
    <aside
      className={`
        ${isOpen ? "w-60" : "w-16"}
        flex-shrink-0 bg-white border-r border-slate-100
        flex flex-col transition-all duration-300 z-10
      `}
    >
      {/* ── Logo & Toggle ── */}
      <div className="h-16 flex items-center px-4 border-b border-slate-100 gap-3">
        <div className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center flex-shrink-0"
          onClick={handleToggleSidebar}>
          <GraduationCap className="w-4 h-4 text-white" />
        </div>

        {isOpen && (
          <div className="overflow-hidden">
            <p className="text-sm font-black text-slate-800 leading-tight">JHS Registrar</p>
            <p className="text-[10px] text-slate-400 leading-tight">Management System</p>
          </div>
        )}

        <button
          className="ml-auto text-slate-400 hover:text-slate-600 transition-colors"
          onClick={handleToggleSidebar}
          aria-label={isOpen ? "Collapse sidebar" : "Expand sidebar"}
        >
          {isOpen ? <X className="w-4 h-4" /> : undefined}
        </button>
      </div>

      {/* ── Navigation ── */}
      <nav className="flex-1 py-4 px-2 overflow-y-auto space-y-0.5">
        {NAV_ITEMS.map((item) => {
          const parentActive = isParentActive(item);
          const isExpanded = expandedItems.includes(item.href);
          const hasChildren = !!item.children?.length;

          return (
            <div key={item.href}>
              <button
                onClick={() => handleParentClick(item)}
                title={!isOpen ? item.label : undefined}
                className={`
                  w-full flex items-center gap-3 px-3 py-2.5 rounded-lg
                  text-sm font-medium transition-colors text-left
                  ${parentActive
                    ? "bg-teal-50 text-teal-800"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
                  }
                `}
              >
                <item.icon className={`w-4 h-4 flex-shrink-0 ${parentActive ? "text-teal-600" : ""}`} />

                {isOpen && (
                  <>
                    <span className="flex-1 truncate">{item.label}</span>
                    {hasChildren && (
                      isExpanded
                        ? <ChevronDown className="w-3.5 h-3.5 opacity-40 flex-shrink-0" />
                        : <ChevronRight className="w-3.5 h-3.5 opacity-40 flex-shrink-0" />
                    )}
                  </>
                )}
              </button>

              {isOpen && hasChildren && isExpanded && (
                <div className="ml-7 mt-0.5 mb-1 pl-3 border-l-2 border-slate-100 space-y-0.5">
                  {item.children!.map((child) => (
                    <button
                      key={child.href}
                      onClick={() => navigate(child.href)}
                      className={`
                        w-full text-left px-2 py-1.5 rounded-md
                        text-xs font-medium transition-colors
                        ${isChildActive(child.href)
                          ? "text-teal-800 bg-teal-50"
                          : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"
                        }
                      `}
                    >
                      {child.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* ── Settings ── */}
      <div className="px-2 pb-2">
        <button
          title={!isOpen ? "Settings" : undefined}
          onClick={() => navigate("/settings")}
          className={`
            w-full flex items-center gap-3 px-3 py-2.5 rounded-lg
            text-sm font-medium transition-colors
            ${pathname === "/settings"
              ? "bg-teal-50 text-teal-800"
              : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
            }
          `}
        >
          <Settings className="w-4 h-4 flex-shrink-0" />
          {isOpen && <span>Settings</span>}
        </button>
      </div>

      {/* ── User Footer ── */}
      <div className="p-3 border-t border-slate-100">
        <div className="flex items-center gap-2.5">
          <Avatar className="w-8 h-8 flex-shrink-0">
            <AvatarFallback className="bg-teal-100 text-teal-800 text-xs font-bold">
              {displayInitials}
            </AvatarFallback>
          </Avatar>

          {isOpen && (
            <>
              <div className="flex-1 overflow-hidden">
                <p className="text-xs font-semibold text-slate-700 truncate">{displayName}</p>
                <p className="text-[10px] text-slate-400">{displayRole}</p>
              </div>
              <button
                onClick={handleLogout}
                title="Log out"
                className="text-slate-400 hover:text-red-500 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </>
          )}
        </div>
      </div>
    </aside>
  );
}