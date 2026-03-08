import React from 'react';
import { format, isSameDay, isSameMonth } from 'date-fns';
import { ContestEvent } from '../../types';
import EventBlock from './EventBlock';

interface CalendarDayProps {
  day: Date;
  currentMonth: Date;
  events: ContestEvent[];
  darkMode: boolean;
  onEventClick: (event: ContestEvent) => void;
}

const CalendarDay: React.FC<CalendarDayProps> = ({ 
  day, 
  currentMonth, 
  events, 
  darkMode,
  onEventClick 
}) => {
  const isToday = isSameDay(day, new Date());
  const isCurrentMonth = isSameMonth(day, currentMonth);
  
  // Base Styles
  const baseClasses = "relative min-h-[80px] md:min-h-[120px] p-1 md:p-2 border-r-4 border-b-4 flex flex-col";
  
  // Theme Styles
  const lightModeClasses = `
    ${isCurrentMonth ? 'bg-[#f4f4f4] text-gray-900' : 'bg-gray-200 text-gray-400 bg-pixel-pattern'} 
    border-gray-300 hover:bg-white
  `;
  
  const darkModeClasses = `
    ${isCurrentMonth ? 'bg-[#2a2a2a] text-gray-200' : 'bg-[#1a1a1a] text-gray-600 bg-pixel-pattern'} 
    border-gray-700 hover:bg-[#333]
  `;

  const classes = `${baseClasses} ${darkMode ? darkModeClasses : lightModeClasses}`;

  return (
    <div className={classes}>
      <div className={`
        flex justify-between items-start mb-1
        ${!isCurrentMonth && 'opacity-50'}
      `}>
        <span className={`
          text-xs md:text-sm font-bold
          ${isToday ? 'bg-red-500 text-white px-1.5 py-0.5 border-2 border-black' : ''}
        `}>
          {format(day, 'd')}
        </span>
      </div>
      
      <div className="flex-1 flex flex-col gap-0.5 overflow-y-auto custom-scrollbar">
        {events.map((event, idx) => (
          <EventBlock 
            key={`${event.platform}-${event.start}-${idx}`} 
            event={event} 
            onClick={onEventClick} 
          />
        ))}
      </div>
    </div>
  );
};

export default CalendarDay;