import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string | number;
  subValue?: string;
  icon?: React.ElementType;
  iconColor?: string;
  iconBg?: string;
  className?: string;
  onClick?: () => void;
  accent?: string; // Optional accent color (e.g. "bg-teal-500")
}

export function StatCard({
  label,
  value,
  subValue,
  icon: Icon,
  iconColor = "text-slate-600",
  iconBg = "bg-slate-100",
  className,
  onClick,
  accent,
}: StatCardProps) {
  return (
    <Card
      className={cn(
        "relative overflow-hidden border-0 shadow-sm transition-all duration-200",
        onClick && "cursor-pointer hover:shadow-md hover:-translate-y-0.5",
        className
      )}
      onClick={onClick}
    >
      {accent && <div className={cn("absolute inset-0 opacity-5", accent)} />}
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1 truncate">
              {label}
            </p>
            <p className="text-3xl font-black text-slate-800 leading-none truncate">
              {value}
            </p>
            {subValue && (
              <p className="text-xs text-slate-400 mt-1.5 font-medium truncate">
                {subValue}
              </p>
            )}
          </div>
          {Icon && (
            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0", iconBg, iconColor)}>
              <Icon className="w-5 h-5" />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
