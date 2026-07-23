"use client";

import { motion } from "framer-motion";

interface TableCardProps {
  children: React.ReactNode;
}

export default function TableCard({ children }: TableCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/80 backdrop-blur-md rounded-3xl border border-zinc-200/60 shadow-xs overflow-hidden"
    >
      {children}
    </motion.div>
  );
}
