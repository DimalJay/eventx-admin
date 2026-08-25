"use client";

import React from "react";
import { Eye, XCircle } from "lucide-react";

interface EventsTableProps {
  paginatedEvents: any[];
  onRowClick: (event: any) => void;
  getOrganizerName: (organizerId: number) => string;
  formatDate: (dateString: string) => string;
  getEventStatus: (event: any) => string;
}

export default function EventsTable({
  paginatedEvents,
  onRowClick,
  getOrganizerName,
  formatDate,
  getEventStatus,
}: EventsTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm whitespace-nowrap">
        <thead className="bg-zinc-50 text-zinc-500 font-semibold border-b border-zinc-200/60">
          <tr>
            <th className="px-6 py-4">Event Name</th>
            <th className="px-6 py-4">Organizer</th>
            <th className="px-6 py-4">Date</th>
            <th className="px-6 py-4">Capacity</th>
            <th className="px-6 py-4">Status</th>
            <th className="px-6 py-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-100">
          {paginatedEvents.map((event) => {
            const status = getEventStatus(event);
            return (
              <tr key={event.id} className="hover:bg-zinc-50/50 transition-colors group">
                <td 
                  onClick={() => onRowClick(event)}
                  className="px-6 py-4 font-semibold text-zinc-900 cursor-pointer hover:text-black hover:underline transition-all"
                >
                  {event.title}
                </td>
                <td className="px-6 py-4 text-zinc-500">{getOrganizerName(event.organizerId)}</td>
                <td className="px-6 py-4 text-zinc-500">{formatDate(event.startDate)}</td>
                <td className="px-6 py-4 text-zinc-500">{event.capacity > 0 ? `0 / ${event.capacity}` : "Unlimited"}</td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    status === 'Scheduled' ? 'bg-blue-50 text-blue-700' : 
                    status === 'Ongoing' ? 'bg-amber-50 text-amber-700' :
                    status === 'Completed' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
                  }`}>
                    {status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-1.5 text-zinc-400 hover:text-zinc-900 rounded-lg hover:bg-zinc-100" title="View"><Eye size={16}/></button>
                    <button className="p-1.5 text-zinc-400 hover:text-red-600 rounded-lg hover:bg-red-50" title="Cancel"><XCircle size={16}/></button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
