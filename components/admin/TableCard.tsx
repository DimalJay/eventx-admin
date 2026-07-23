"use client";

interface TableCardProps {
  children: React.ReactNode;
}

export default function TableCard({ children }: TableCardProps) {
  return (
    <div
      className="bg-white/80 backdrop-blur-md rounded-3xl border border-zinc-200/60 shadow-xs overflow-hidden"
    >
      {children}
    </div>
  );
}
