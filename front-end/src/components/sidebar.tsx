import { useState, useEffect } from "react";
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
  ChevronRight,
  Pin,
  PinOff,
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
      { label: "School Profile", href: "/school/profile" },
      { label: "School Years", href: "/school/years" },
      { label: "Sections", href: "/school/sections" },
      { label: "Advisers & Teachers", href: "/school/advisers" },
    ],
  },
  {
    icon: UserSquare2,
    label: "Students",
    href: "/students",
    children: [
      { label: "Student List", href: "/students" },
      { label: "Enroll Student", href: "/students/enroll" },
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
      { label: "New Import", href: "/import/new" },
      { label: "Import History", href: "/import/history" },
    ],
  },
  {
    icon: ClipboardList,
    label: "Grade Encoding",
    href: "/grades",
    children: [
      { label: "Class Grade Sheet", href: "/grades" },
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

  // Sidebar pinned and hover states
  const [isPinned, setIsPinned] = useState(() => localStorage.getItem("sidebar_pinned") === "true");
  const [isHovered, setIsHovered] = useState(false);

  const isOpen = controlledOpen !== undefined ? controlledOpen : (isPinned || isHovered);

  const getActiveItems = () => NAV_ITEMS
    .filter((item) =>
      item.children?.some((child) => pathname.startsWith(child.href)) ||
      pathname.startsWith(item.href)
    )
    .map((item) => item.href);

  const [expandedItems, setExpandedItems] = useState<string[]>(getActiveItems);

  // Auto-collapse manually opened sub-sections when sidebar closes
  useEffect(() => {
    if (!isOpen && !isPinned) {
      setExpandedItems(getActiveItems());
    }
  }, [isOpen, isPinned]);

  // Sync expanded items when navigating (important for persistent layout)
  useEffect(() => {
    setExpandedItems(getActiveItems());
  }, [pathname]);

  function handleTogglePin() {
    const next = !isPinned;
    setIsPinned(next);
    localStorage.setItem("sidebar_pinned", String(next));
    onOpenChange?.(next);
  }

  function handleParentClick(item: NavItem) {
    if (item.children?.length) {
      setExpandedItems((prev) =>
        prev.includes(item.href)
          ? prev.filter((h) => h !== item.href)
          : [...prev, item.href]
      );
    } else {
      navigate(item.href);
    }
  }

  function isParentActive(item: NavItem): boolean {
    if (item.children) return item.children.some((c) => pathname.startsWith(c.href));
    return pathname === item.href;
  }

  function isChildActive(href: string, parentHref: string): boolean {
    // If the child href is the same as the parent href (e.g., /grades),
    // only highlight it if it's an exact match.
    if (href === parentHref) {
      return pathname === href;
    }
    return pathname === href || pathname.startsWith(href + "/");
  }

  return (
    <aside
      className={`
        ${isPinned ? "w-64" : "w-20"}
        flex-shrink-0 transition-all duration-300 ease-in-out relative z-30
        print:hidden
      `}
    >
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`
          flex flex-col h-full bg-white border-r border-slate-100
          transition-all duration-300 ease-in-out
          ${isOpen ? "w-64 shadow-1xl" : "w-20 shadow-none"}
          ${!isPinned && isHovered ? "absolute top-0 left-0 h-screen rounded-r-2xl" : "relative"}
        `}
      >
        {/* ── Logo & Toggle ── */}
        <div className={`h-20 flex items-center border-b border-slate-50 gap-3 px-5 transition-all duration-300`}>
          <div className="w-10 h-10 rounded-xl bg-teal-600 flex items-center justify-center flex-shrink-0 cursor-pointer shadow-lg shadow-teal-100 ring-4 ring-teal-50"
            onClick={handleTogglePin}>
            <GraduationCap className="w-5 h-5 text-white" />
          </div>

          {isOpen && (
            <div className="overflow-hidden flex-1 animate-in fade-in slide-in-from-left-4 duration-500">
              <p className="text-sm font-black text-slate-800 tracking-tight leading-none">Berkeley SIS</p>
              <p className="text-[10px] uppercase font-bold text-slate-400 mt-1 tracking-wider text-nowrap">Registrar Office</p>
            </div>
          )}

          {isOpen && (
            <button
              className={`
                p-2 rounded-xl transition-all duration-300
                ${isPinned ? "text-teal-600 bg-teal-50" : "text-slate-300 hover:text-slate-500 hover:bg-slate-50"}
              `}
              onClick={handleTogglePin}
              title={isPinned ? "Unpin sidebar" : "Pin sidebar"}
            >
              {isPinned ? <Pin className="w-4 h-4 fill-current rotate-45" /> : <PinOff className="w-4 h-4" />}
            </button>
          )}
        </div>

        {/* ── Navigation ── */}
        <nav className="flex-1 py-6 px-3 overflow-y-auto space-y-1 scrollbar-hide">
          {NAV_ITEMS.map((item) => {
            const parentActive = isParentActive(item);
            const isExpanded = expandedItems.includes(item.href);
            const hasChildren = !!item.children?.length;

            return (
              <div key={item.href} className="space-y-1">
                <button
                  onClick={() => handleParentClick(item)}
                  className={`
                    w-full flex items-center gap-3 px-4 py-3 rounded-xl
                    text-sm font-bold transition-all text-left group
                    ${parentActive
                      ? "bg-teal-50 text-teal-700 shadow-sm shadow-teal-50"
                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                    }
                  `}
                >
                  <item.icon className={`w-5 h-5 flex-shrink-0 transition-transform duration-300 group-hover:scale-110 ${parentActive ? "text-teal-600" : "text-slate-400"}`} />

                  {isOpen && (
                    <div className="flex-1 flex items-center justify-between min-w-0 animate-in fade-in slide-in-from-left-2 duration-300">
                      <span className="truncate">{item.label}</span>
                      {hasChildren && (
                        <ChevronRight className={`w-4 h-4 opacity-30 transition-transform duration-300 ${isExpanded ? "rotate-90" : ""}`} />
                      )}
                    </div>
                  )}
                </button>

                {isOpen && hasChildren && isExpanded && (
                  <div className="ml-6 pl-4 border-l-2 border-slate-50 space-y-1 animate-in slide-in-from-top-2 duration-300">
                    {item.children!.map((child) => (
                      <button
                        key={child.href}
                        onClick={() => navigate(child.href)}
                        className={`
                          w-full text-left px-3 py-2 rounded-lg
                          text-xs font-semibold transition-all
                          ${isChildActive(child.href, item.href)
                            ? "text-teal-700 bg-teal-50/50"
                            : "text-slate-400 hover:text-slate-700 hover:bg-slate-50"
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

        {/* ── Footer Actions ── */}
        <div className="px-3 pb-3 space-y-1 border-t border-slate-50 pt-3">
          <button
            onClick={() => navigate("/settings")}
            className={`
              w-full flex items-center gap-3 px-4 py-3 rounded-xl
              text-sm font-bold transition-all
              ${pathname === "/settings"
                ? "bg-teal-50 text-teal-700"
                : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
              }
            `}
          >
            <Settings className={`w-5 h-5 flex-shrink-0 ${pathname === "/settings" ? "text-teal-600" : "text-slate-400"}`} />
            {isOpen && <span className="animate-in fade-in slide-in-from-left-2 duration-300">Settings</span>}
          </button>
        </div>

        {/* ── User Profile ── */}
        <div className="p-4 border-t border-slate-50">
          <div className="flex items-center gap-3 px-1">
            <Avatar className="w-10 h-10 flex-shrink-0 shadow-sm ring-2 ring-white ring-offset-2 ring-offset-slate-50">
              <AvatarFallback className="bg-gradient-to-br from-teal-500 to-teal-700 text-white text-xs font-black ring-1 ring-teal-600">
                {displayInitials}
              </AvatarFallback>
            </Avatar>

            {isOpen && (
              <div className="flex-1 flex items-center gap-2 overflow-hidden animate-in fade-in slide-in-from-left-2 duration-300">
                <div className="flex-1 overflow-hidden">
                  <p className="text-xs font-black text-slate-800 truncate">{displayName}</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter truncate">{displayRole}</p>
                </div>
                <button
                  onClick={handleLogout}
                  title="Log out"
                  className="bg-slate-50 text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all p-2 rounded-lg"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}