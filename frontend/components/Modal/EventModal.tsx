import React from 'react';
import { ContestEvent, PLATFORM_COLORS } from '../../types';
import PixelButton from '../UI/PixelButton';
import { differenceInMinutes, format } from 'date-fns';

interface EventModalProps {
  event: ContestEvent | null;
  onClose: () => void;
  darkMode: boolean;
}

const EventModal: React.FC<EventModalProps> = ({ event, onClose, darkMode }) => {
  if (!event) return null;

  const startDate = new Date(event.start);
  const endDate = new Date(event.end);
  const durationMinutes = differenceInMinutes(endDate, startDate);
  const hours = Math.floor(durationMinutes / 60);
  const minutes = durationMinutes % 60;
  
  const platformColor = PLATFORM_COLORS[event.platform.toLowerCase()] || PLATFORM_COLORS.other;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div 
        className={`
          relative w-full max-w-md border-[6px] 
          ${darkMode ? 'bg-retro-dark border-gray-400 text-gray-200' : 'bg-retro-light border-black text-gray-900'}
          shadow-[8px_8px_0px_0px_rgba(0,0,0,0.5)]
        `}
      >
        {/* Title Bar */}
        <div className={`
          flex justify-between items-center px-4 py-2 border-b-4 
          ${darkMode ? 'bg-gray-700 border-gray-500' : 'bg-blue-800 border-black'}
        `}>
          <h3 className="text-white text-xs uppercase tracking-wider">Event Details</h3>
          <button 
            onClick={onClose}
            className="text-white hover:text-red-400 text-lg leading-none"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col gap-6">
          <div className="flex items-center gap-4">
            <div 
              className="w-16 h-16 border-4 border-black shrink-0 flex items-center justify-center text-2xl font-bold text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)]"
              style={{ backgroundColor: platformColor }}
            >
              {event.platform.substring(0, 1).toUpperCase()}
            </div>
            <div>
              <h2 className="text-sm md:text-lg font-bold leading-snug mb-2">{event.title}</h2>
              <span 
                className="inline-block px-2 py-1 text-[10px] text-white border-2 border-black/20"
                style={{ backgroundColor: platformColor }}
              >
                {event.platform.toUpperCase()}
              </span>
            </div>
          </div>

          <div className={`p-4 border-4 border-dashed ${darkMode ? 'border-gray-600 bg-black/20' : 'border-gray-400 bg-white/50'}`}>
            <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-xs">
              <span className="font-bold">DATE:</span>
              <span>{format(startDate, 'MMM d, yyyy')}</span>
              
              <span className="font-bold">START:</span>
              <span>{format(startDate, 'h:mm a')}</span>
              
              <span className="font-bold">DUR:</span>
              <span>{hours}h {minutes > 0 ? `${minutes}m` : ''}</span>
            </div>
          </div>

          <div className="flex gap-4 mt-2">
            <a 
              href={event.raw?.contestUrl || event.raw?.link || '#'} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex-1"
            >
              <PixelButton className="w-full text-center" variant="primary">JOIN GAME</PixelButton>
            </a>
            <PixelButton onClick={onClose} variant="secondary">CLOSE</PixelButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventModal;