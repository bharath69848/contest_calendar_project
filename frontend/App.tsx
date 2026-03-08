import React, { useState, useEffect } from 'react';
import { ContestEvent, PLATFORM_COLORS } from './types';
import CalendarGrid from './components/Calendar/CalendarGrid';
import EventModal from './components/Modal/EventModal';
import { MOCK_DATA } from './services/mockData';
import api from './services/api';

const ALL_PLATFORMS = ['leetcode', 'codeforces', 'atcoder', 'codechef'];

const PLATFORM_LABELS: Record<string, string> = {
  leetcode: 'LeetCode',
  codeforces: 'Codeforces',
  atcoder: 'AtCoder',
  codechef: 'CodeChef',
};

const App: React.FC = () => {
  const [allEvents, setAllEvents] = useState<ContestEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<ContestEvent | null>(null);
  const [darkMode, setDarkMode] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [enabledPlatforms, setEnabledPlatforms] = useState<Set<string>>(
    new Set(ALL_PLATFORMS)
  );

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const rows = await api.fetchContests();
        if (rows.length === 0) {
          // DB might still be empty (first run scrapers not done yet) — use mock
          setAllEvents(MOCK_DATA.events);
        } else {
          const nowSec = Math.floor(Date.now() / 1000);
          const mapped: ContestEvent[] = rows.map(r => {
            const platform = (r.platform || 'other').toLowerCase();

            // Codeforces URL strategy:
            //  - UPCOMING (start_time still in the future): codeforces.com/contest/{id}
            //    doesn't have a page yet — it redirects to the LAST contest instead.
            //    Use the Codeforces contests listing page so users can find and register.
            //  - ONGOING / FINISHED: use the direct contest/{id} URL which works fine.
            let contestUrl = r.url || undefined;
            if (platform === 'codeforces') {
              const isUpcoming = r.start_time != null && r.start_time > nowSec;
              if (isUpcoming) {
                contestUrl = 'https://codeforces.com/contests';
              } else if (r.contest_id) {
                contestUrl = `https://codeforces.com/contest/${r.contest_id}`;
              }
            }

            return {
              platform,
              title: r.title || '',
              start: r.start_time ? new Date(r.start_time * 1000).toISOString() : '',
              end: r.end_time
                ? new Date(r.end_time * 1000).toISOString()
                : r.start_time
                  ? new Date((r.start_time + (r.duration_seconds || 7200)) * 1000).toISOString()
                  : '',
              raw: { contestUrl },
            };
          });
          mapped.sort((a, b) => {
            if (!a.start) return 1;
            if (!b.start) return -1;
            return new Date(a.start).getTime() - new Date(b.start).getTime();
          });
          setAllEvents(mapped);
        }
      } catch (err) {
        console.error('Failed to fetch from backend, falling back to mock data', err);
        setError('Could not connect to the backend. Showing sample data.');
        setAllEvents(MOCK_DATA.events);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Filter events by the enabled platforms
  const events = allEvents.filter(e =>
    enabledPlatforms.has((e.platform || 'other').toLowerCase())
  );

  const togglePlatform = (platform: string) => {
    setEnabledPlatforms(prev => {
      const next = new Set(prev);
      if (next.has(platform)) {
        next.delete(platform);
      } else {
        next.add(platform);
      }
      return next;
    });
  };

  return (
    <div className={`min-h-screen w-full font-pixel selection:bg-pink-500 selection:text-white transition-colors duration-300
      ${darkMode ? 'bg-[#1a1025]' : 'bg-[#e8e0cc]'}
    `}>
      {/* Scanline Overlay */}
      <div className="scanlines z-50 pointer-events-none" />

      {/* Main Container */}
      <div className="container mx-auto px-2 py-8 max-w-5xl relative z-10">

        {/* Header */}
        <header className="mb-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <div className={`
              w-12 h-12 border-4 border-black flex items-center justify-center text-2xl
              ${darkMode ? 'bg-purple-600 text-white shadow-[4px_4px_0px_0px_#fff]' : 'bg-orange-400 text-white shadow-[4px_4px_0px_0px_#000]'}
            `}>
              
            </div>
            <div>
              <h1 className={`text-xl md:text-3xl font-bold ${darkMode ? 'text-white text-shadow-neon' : 'text-black'}`}>
                CONTEST_CALENDAR
              </h1>
              <p className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                v1.0.0 
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`
                w-10 h-10 border-4 border-black flex items-center justify-center text-lg transition-transform active:scale-90
                ${darkMode ? 'bg-yellow-400 text-black shadow-[4px_4px_0px_0px_#fff]' : 'bg-gray-800 text-white shadow-[4px_4px_0px_0px_#000]'}
              `}
              title="Toggle Theme"
            >
              {darkMode ? '☀' : '☾'}
            </button>
          </div>
        </header>

        {/* Error Banner */}
        {error && (
          <div className={`
            mb-4 px-4 py-3 border-4 border-red-500 text-xs font-bold flex items-center gap-3
            ${darkMode ? 'bg-red-900/40 text-red-300' : 'bg-red-100 text-red-700'}
          `}>
            <span className="text-lg">⚠</span>
            <span>{error}</span>
            <button
              onClick={() => setError(null)}
              className="ml-auto text-lg leading-none hover:opacity-70"
            >×</button>
          </div>
        )}

        {/* Platform Filter Bar */}
        <div className={`
          mb-6 p-4 border-4 flex flex-wrap gap-3 text-[10px] md:text-xs font-bold
          ${darkMode ? 'bg-black/30 border-gray-600 text-gray-300' : 'bg-white/50 border-gray-400 text-gray-700'}
        `}>
          <span className={`self-center mr-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>FILTER:</span>
          {ALL_PLATFORMS.map(platform => {
            const active = enabledPlatforms.has(platform);
            const color = PLATFORM_COLORS[platform];
            return (
              <button
                key={platform}
                onClick={() => togglePlatform(platform)}
                className={`
                  flex items-center gap-1.5 px-2 py-1 border-2 border-black transition-all
                  ${active ? 'opacity-100 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.4)]' : 'opacity-40'}
                `}
                style={{ backgroundColor: active ? color : 'transparent', color: active ? '#fff' : 'inherit' }}
              >
                <span
                  className="w-2 h-2 inline-block border border-current"
                  style={{ backgroundColor: active ? '#fff' : color }}
                />
                {PLATFORM_LABELS[platform]}
              </button>
            );
          })}
        </div>

        {/* Loading State */}
        {loading ? (
          <div className={`
            flex flex-col items-center justify-center py-24 border-4 gap-4
            ${darkMode ? 'border-gray-600 text-gray-400 bg-black/20' : 'border-gray-400 text-gray-500 bg-white/30'}
          `}>
            <div className={`
              w-12 h-12 border-4 border-t-transparent animate-spin
              ${darkMode ? 'border-purple-400' : 'border-orange-500'}
            `} />
            <p className="text-xs font-bold tracking-widest animate-pulse">LOADING CONTESTS...</p>
          </div>
        ) : (
          /* Calendar Grid */
          <CalendarGrid
            events={events}
            darkMode={darkMode}
            onEventClick={setSelectedEvent}
          />
        )}

      {/* Modal Layer */}
      {selectedEvent && (
        <EventModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
          darkMode={darkMode}
        />
      )}
    </div>
  );
};

export default App;
