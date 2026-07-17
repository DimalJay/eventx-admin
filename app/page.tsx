"use client";

import React from "react";
import { motion, Variants } from "framer-motion";
import {
  Users,
  Calendar,
  Ticket,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  UserPlus,
  AlertCircle
} from "lucide-react";

// Mock data based on spec
const STATS = [
  {
    title: "Total Active Users",
    value: "12,450",
    change: "+12.5%",
    isPositive: true,
    icon: Users,
    color: "bg-zinc-100 text-zinc-900"
  },
  {
    title: "Total Events Created",
    value: "842",
    change: "+5.2%",
    isPositive: true,
    icon: Calendar,
    color: "bg-zinc-100 text-zinc-900"
  },
  {
    title: "Total Registrations",
    value: "45,231",
    change: "+18.1%",
    isPositive: true,
    icon: Ticket,
    color: "bg-zinc-100 text-zinc-900"
  },
  {
    title: "System Uptime",
    value: "99.99%",
    change: "0.00%",
    isPositive: true,
    icon: Activity,
    color: "bg-zinc-100 text-zinc-900"
  }
];

const RECENT_ACTIVITIES = [
  { id: 1, type: "event", title: "New Event Created: Tech Symposium 2026", time: "10 mins ago", icon: Calendar, color: "text-zinc-900 bg-zinc-100" },
  { id: 2, type: "user", title: "New Organizer Registration: CodeClub", time: "35 mins ago", icon: UserPlus, color: "text-zinc-900 bg-zinc-100" },
  { id: 3, type: "alert", title: "High memory usage detected on Web Server 02", time: "1 hour ago", icon: AlertCircle, color: "text-red-600 bg-red-50" },
  { id: 4, type: "payment", title: "Payment batch processed: $4,520.00", time: "2 hours ago", icon: DollarSign, color: "text-zinc-900 bg-zinc-100" },
  { id: 5, type: "user", title: "Account suspended: user123 (Policy Violation)", time: "3 hours ago", icon: Users, color: "text-red-600 bg-red-50" },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export default function AdminDashboard() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-950 tracking-tight">Dashboard Overview</h1>
          <p className="text-zinc-500 text-sm mt-1">Welcome back, here's what's happening today.</p>
        </div>

        <div className="flex items-center gap-3">
          <button className="px-5 py-2.5 bg-white border border-zinc-200/80 text-zinc-700 rounded-full text-xs font-semibold uppercase tracking-wider hover:bg-zinc-50 transition shadow-xs">
            Export Report
          </button>
          <button className="px-5 py-2.5 bg-black text-white rounded-full text-xs font-semibold uppercase tracking-wider hover:bg-black/90 transition shadow-xs">
            View Analytics
          </button>
        </div>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6"
      >
        {STATS.map((stat, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
            className="bg-white/80 backdrop-blur-md rounded-3xl p-6 border border-zinc-200/60 shadow-xs hover:shadow-md transition relative overflow-hidden group"
          >
            <div className="flex items-start justify-between">
              <div className={`p-3 rounded-2xl ${stat.color}`}>
                <stat.icon size={22} />
              </div>
              <div className={`flex items-center gap-1 text-[11px] font-bold px-2 py-1 rounded-full ${stat.isPositive ? 'text-emerald-700 bg-emerald-50' : 'text-red-700 bg-red-50'}`}>
                {stat.isPositive ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
                {stat.change}
              </div>
            </div>

            <div className="mt-4">
              <p className="text-zinc-500 text-xs font-semibold uppercase tracking-wider">{stat.title}</p>
              <h3 className="text-3xl font-semibold text-zinc-950 mt-1 tracking-tight">{stat.value}</h3>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content Area (Chart Placeholder) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="lg:col-span-2 bg-white/80 backdrop-blur-md rounded-3xl border border-zinc-200/60 shadow-xs p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-zinc-950">Revenue & Registrations</h2>
            <select className="bg-zinc-50 border border-zinc-200 text-zinc-700 text-sm rounded-xl px-3 py-1.5 outline-none focus:ring-2 focus:ring-zinc-950/20">
              <option>This Week</option>
              <option>This Month</option>
              <option>This Year</option>
            </select>
          </div>

          <div className="h-[300px] w-full flex items-end gap-2 justify-between px-4 pb-4">
            {/* Minimal CSS Chart Placeholder */}
            {[40, 70, 45, 90, 65, 85, 100].map((height, i) => (
              <div key={i} className="w-full max-w-[40px] flex flex-col justify-end items-center gap-2 group relative">
                <div className="absolute -top-8 bg-zinc-950 text-white text-[10px] font-bold uppercase tracking-wider py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                  {height}%
                </div>
                <div
                  className="w-full bg-zinc-100 rounded-t-lg relative overflow-hidden group-hover:bg-zinc-200 transition-colors"
                  style={{ height: `${height}%` }}
                >
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${height}%` }}
                    transition={{ duration: 1, delay: 0.5 + (i * 0.1) }}
                    className="absolute bottom-0 w-full bg-zinc-950 rounded-t-lg"
                  />
                </div>
                <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Day {i + 1}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recent Activity Feed */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="bg-white/80 backdrop-blur-md rounded-3xl border border-zinc-200/60 shadow-xs p-6 flex flex-col"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-zinc-950">Recent Activity</h2>
            <button className="text-xs text-zinc-900 font-semibold uppercase tracking-wider hover:text-zinc-600 transition">View All</button>
          </div>

          <div className="flex-1 overflow-y-auto pr-2 space-y-6">
            {RECENT_ACTIVITIES.map((activity, index) => (
              <div key={activity.id} className="relative flex items-start gap-4 group">
                <div className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${activity.color} ring-4 ring-white group-hover:scale-110 transition-transform`}>
                  <activity.icon size={18} />
                </div>
                <div className="pt-1 flex-1">
                  <p className="text-sm font-semibold text-zinc-800 leading-tight">{activity.title}</p>
                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
