import React from "react";
import { Outlet, Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import Sidebar from "./sidebar";
import { HeaderProvider, useHeader } from "@/contexts/HeaderContext";

function Header() {
  const { title, subtitle, breadcrumbs, actions, extra } = useHeader();

  return (
    <header className="h-24 bg-white border-b border-slate-100 flex items-center px-8 gap-4 sticky top-0 z-10">
      <div className="flex-1 min-w-0">
        {breadcrumbs && breadcrumbs.length > 0 && (
          <div className="flex items-center gap-2 mb-1.5 opacity-80">
            {breadcrumbs.map((bc, i) => (
              <React.Fragment key={i}>
                {bc.onClick ? (
                  <button
                    onClick={bc.onClick}
                    className="text-[10px] uppercase tracking-wider font-bold text-slate-400 hover:text-teal-600 transition-colors"
                  >
                    {bc.label}
                  </button>
                ) : bc.href ? (
                  <Link to={bc.href} className="text-[10px] uppercase tracking-wider font-bold text-slate-400 hover:text-teal-600 transition-colors">
                    {bc.label}
                  </Link>
                ) : (
                  <span className={`text-[10px] uppercase tracking-wider font-bold ${i === breadcrumbs.length - 1 ? "text-slate-600" : "text-slate-400"}`}>
                    {bc.label}
                  </span>
                )}
                {i < breadcrumbs.length - 1 && <ChevronRight className="w-3 h-3 text-slate-300 mx-0.5" />}
              </React.Fragment>
            ))}
          </div>
        )}
        
        <div className="flex flex-col">
          {title && (
            <h1 className="text-2xl font-black text-slate-800 tracking-tight leading-none group flex items-center gap-2">
              {title}
            </h1>
          )}
          {subtitle && (
            <p className="text-sm text-slate-400 font-medium mt-1">{subtitle}</p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3">
        {extra}
        {actions}
      </div>
    </header>
  );
}

export default function MainLayout() {
  return (
    <HeaderProvider>
      <div className="flex h-screen bg-slate-50 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto flex flex-col relative">
          <Header />
          <Outlet />
        </main>
      </div>
    </HeaderProvider>
  );
}
