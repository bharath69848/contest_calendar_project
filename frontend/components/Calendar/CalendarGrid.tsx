import React, { useState, useEffect } from 'react';
import { 
  startOfWeek, 
  startOfMonth, 
  endOfWeek, 
  endOfMonth, 
  eachDayOfInterval, 
  subMonths, 
  addMonths, 
  format, 
  isSameDay 
} from 'date-fns';
import { ContestEvent } from '../../types';
import CalendarDay from './CalendarDay';
import PixelButton from '../UI/PixelButton';

interface CalendarGridProps {
  events: ContestEvent[];
  darkMode: boolean;
  onEventClick: (event: ContestEvent) => void;
}

const CalendarGrid: React.FC<CalendarGridProps> = ({ events, darkMode, onEventClick }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const startDate = startOfWeek(startOfMonth(currentDate));
  const endDate = endOfWeek(endOfMonth(currentDate));
  
  const daysInGrid = eachDayOfInterval({
    start: startDate,
    end: endDate,
  });

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const jumpToToday = () => setCurrentDate(new Date());

  const getEventsForDay = (day: Date) => {
    return events.filter(event => 
      isSameDay(new Date(event.start), day)
    ).sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());
  };

  return (
    <div className={`
      border-[6px] 
      ${darkMode ? 'border-gray-500 bg-[#111]' : 'border-black bg-[#8b7050]'}
      shadow-[8px_8px_0px_0px_rgba(0,0,0,0.4)]
    `}>
      {/* Header Controls */}
      <div className={`
        flex flex-col md:flex-row justify-between items-center p-4 border-b-[6px] gap-4
        ${darkMode ? 'bg-gray-800 border-gray-500' : 'bg-[#e0d8c0] border-black'}
      `}>
        <div className="flex items-center gap-4">
          <PixelButton onClick={prevMonth} size="sm">{'<'}</PixelButton>
          <h2 className={`text-sm md:text-xl font-bold uppercase tracking-widest ${darkMode ? 'text-white' : 'text-black'}`}>
            {format(currentDate, 'MMMM yyyy')}
          </h2>
          <PixelButton onClick={nextMonth} size="sm">{'>'}</PixelButton>
        </div>
        <PixelButton onClick={jumpToToday} variant="secondary" size="sm">TODAY</PixelButton>
      </div>

      {/* Weekday Headers */}
      <div className={`
        grid grid-cols-7 border-b-4 
        ${darkMode ? 'bg-gray-700 border-gray-600 text-gray-300' : 'bg-[#d0c8b0] border-gray-400 text-gray-700'}
      `}>
        {weekDays.map(day => (
          <div key={day} className="p-2 text-center text-[10px] md:text-xs font-bold border-r-2 last:border-r-0 border-black/10">
            {day}
          </div>
        ))}
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 bg-black gap-[2px] border-black border-2">
        {daysInGrid.map((day, idx) => (
          <CalendarDay
            key={idx}
            day={day}
            currentMonth={currentDate}
            events={getEventsForDay(day)}
            darkMode={darkMode}
            onEventClick={onEventClick}
          />
        ))}
      </div>
    </div>
  );
};

export default CalendarGrid;