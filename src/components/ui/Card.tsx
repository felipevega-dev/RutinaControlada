import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export function Card({ children, className, onClick }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4",
        onClick && "cursor-pointer hover:shadow-md transition-all hover:border-primary-500 dark:hover:border-primary-400",
        className
      )}
    >
      {children}
    </div>
  );
}

