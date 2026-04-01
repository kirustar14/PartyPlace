'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, MapPin, Users, DollarSign, Calendar, Clock, Star } from 'lucide-react';

const ALL_VENUES = [
  { id: 1, name: "SoHo Skyline Loft", location: "SoHo", maxGuestCount: 80, minBudget: 2500, occasions: ["Birthday", "Engagement", "Graduation"], openTimes: ["afternoon", "evening", "night"] },
  { id: 2, name: "Williamsburg Garden House", location: "Williamsburg", maxGuestCount: 40, minBudget: 1200, occasions: ["Anniversary", "Reunion", "Fundraiser"], openTimes: ["morning", "afternoon"] },
  { id: 3, name: "Midtown Grand Hall", location: "Midtown", maxGuestCount: 150, minBudget: 3000, occasions: ["Wedding", "Engagement", "Office Party"], openTimes: ["afternoon", "evening", "night"] },
  { id: 4, name: "Chelsea Corner Studio", location: "Chelsea", maxGuestCount: 25, minBudget: 900, occasions: ["Birthday", "Graduation"], openTimes: ["morning", "afternoon", "evening"] },
  { id: 5, name: "Bushwick Rooftop", location: "Bushwick", maxGuestCount: 70, minBudget: 2200, occasions: ["Birthday", "Happy hour"], openTimes: ["evening", "night"] },
  { id: 6, name: "Tribeca Pearl Venue", location: "Tribeca", maxGuestCount: 120, minBudget: 3500, occasions: ["Wedding", "Anniversary"], openTimes: ["afternoon", "evening"] },
  { id: 7, name: "East Village Social Club", location: "East Village", maxGuestCount: 35, minBudget: 800, occasions: ["Birthday", "Happy hour"], openTimes: ["evening", "night"] },
  { id: 8, name: "Upper West Banquet Room", location: "Upper West Side", maxGuestCount: 60, minBudget: 1800, occasions: ["Graduation", "Reunion"], openTimes: ["morning", "afternoon", "evening"] },
  { id: 9, name: "DUMBO Warehouse Events", location: "DUMBO", maxGuestCount: 110, minBudget: 2700, occasions: ["Office Party", "Holiday Party"], openTimes: ["afternoon", "evening", "night"] },
  { id: 10, name: "Astoria Light Hall", location: "Astoria", maxGuestCount: 50, minBudget: 1100, occasions: ["Birthday", "Anniversary"], openTimes: ["afternoon", "evening"] },
  { id: 11, name: "Greenpoint Harbor Loft", location: "Greenpoint", maxGuestCount: 90, minBudget: 2000, occasions: ["Engagement", "Office Party"], openTimes: ["evening", "night"] },
  { id: 12, name: "Flatiron Private Dining", location: "Flatiron", maxGuestCount: 45, minBudget: 1600, occasions: ["Anniversary", "Engagement"], openTimes: ["afternoon", "evening"] },
  { id: 13, name: "NoHo Velvet Space", location: "NoHo", maxGuestCount: 55, minBudget: 1400, occasions: ["Birthday", "Graduation"], openTimes: ["evening", "night"] },
  { id: 14, name: "Financial District Clubhouse", location: "Financial District", maxGuestCount: 85, minBudget: 2300, occasions: ["Office Party", "Fundraiser"], openTimes: ["afternoon", "evening"] },
  { id: 15, name: "Park Slope Terrace", location: "Park Slope", maxGuestCount: 65, minBudget: 1500, occasions: ["Birthday", "Anniversary"], openTimes: ["morning", "afternoon", "evening"] },
  { id: 16, name: "Harlem Heritage Hall", location: "Harlem", maxGuestCount: 75, minBudget: 1300, occasions: ["Graduation", "Fundraiser"], openTimes: ["afternoon", "evening"] },
  { id: 17, name: "Long Island City Loft", location: "Long Island City", maxGuestCount: 100, minBudget: 1900, occasions: ["Wedding", "Engagement"], openTimes: ["evening", "night"] },
  { id: 18, name: "Battery Park View Room", location: "Battery Park", maxGuestCount: 95, minBudget: 2800, occasions: ["Wedding", "Anniversary"], openTimes: ["afternoon", "evening"] },
  { id: 19, name: "Lower East Side Studio", location: "Lower East Side", maxGuestCount: 50, minBudget: 1000, occasions: ["Birthday", "Reunion"], openTimes: ["afternoon", "evening", "night"] },
  { id: 20, name: "Gramercy Classic Hall", location: "Gramercy", maxGuestCount: 70, minBudget: 2100, occasions: ["Engagement", "Anniversary"], openTimes: ["afternoon", "evening"] },
];

const gradientText = "bg-gradient-to-r from-pink-400 to-purple-500 bg-clip-text text-transparent";
const accentBg = "bg-gradient-to-r from-pink-400 to-purple-500";

const occasionColors: Record<string, string> = {
  Birthday: "bg-pink-100 text-pink-600",
  Wedding: "bg-purple-100 text-purple-600",
  Engagement: "bg-fuchsia-100 text-fuchsia-600",
  Graduation: "bg-violet-100 text-violet-600",
  Anniversary: "bg-rose-100 text-rose-600",
  "Office Party": "bg-indigo-100 text-indigo-600",
  "Happy hour": "bg-pink-100 text-pink-500",
  Fundraiser: "bg-purple-100 text-purple-500",
  "Holiday Party": "bg-fuchsia-100 text-fuchsia-500",
  Reunion: "bg-violet-100 text-violet-500",
  "Bachelor/Bachelorette": "bg-rose-100 text-rose-500",
};

export default function Home() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    try {
      const res = await fetch('http://localhost:3001/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });
      const data = await res.json();
      localStorage.setItem('searchResults', JSON.stringify({ query, ...data }));
      router.push('/results');
    } catch (e) {
      alert('Backend not running! Start it with: cd backend && npm run start:dev');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-gray-100 px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-full ${accentBg}`} />
          <span className={`text-xl font-bold ${gradientText}`}>PartyPlace</span>
        </div>
        <span className="text-sm text-gray-400">NYC Venue Finder</span>
      </div>

      {/* Hero */}
      <div className="max-w-3xl mx-auto px-6 pt-16 pb-10 text-center">
        <div className={`inline-block text-xs font-semibold px-3 py-1 rounded-full ${accentBg} text-white mb-4`}>
          AI-Powered Search
        </div>
        <h1 className="text-5xl font-bold text-gray-900 mb-4 leading-tight">
          Find your perfect <span className={gradientText}>venue</span>
        </h1>
        <p className="text-gray-400 text-lg mb-10">
          Describe your event in plain English — we'll handle the rest.
        </p>

        {/* Search Bar */}
        <div className="relative flex items-center bg-white border-2 border-pink-200 rounded-2xl shadow-lg shadow-pink-50 focus-within:border-purple-400 transition-all px-4 py-3 gap-3">
          <Search className="text-pink-400 shrink-0" size={20} />
          <input
            className="flex-1 outline-none text-gray-700 placeholder-gray-300 text-base bg-transparent"
            placeholder="e.g. Birthday party for 40 people in Brooklyn on Saturday evening, budget $2000"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSearch()}
          />
          <button
            onClick={handleSearch}
            disabled={loading || !query.trim()}
            className={`${accentBg} text-white px-5 py-2 rounded-xl font-medium text-sm transition-opacity disabled:opacity-50 shrink-0`}
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>

        {/* Example pills */}
        <div className="flex flex-wrap gap-2 justify-center mt-4">
          {[
            "Birthday for 50 in SoHo, Saturday night, $2500",
            "Wedding for 100 people, Friday, $3500",
            "Office party weekday afternoon, 80 guests",
          ].map(ex => (
            <button
              key={ex}
              onClick={() => setQuery(ex)}
              className="text-xs px-3 py-1.5 rounded-full border border-pink-200 text-pink-500 hover:bg-pink-50 transition-colors"
            >
              {ex}
            </button>
          ))}
        </div>
      </div>

      {/* All Venues */}
      <div className="max-w-7xl mx-auto px-6 pb-20">
        <div className="flex items-center gap-3 mb-6">
          <h2 className="text-xl font-semibold text-gray-800">All Venues</h2>
          <span className="text-sm text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{ALL_VENUES.length} spaces</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {ALL_VENUES.map(venue => (
            <div key={venue.id} className="bg-white border border-gray-100 rounded-2xl p-5 hover:shadow-md hover:shadow-pink-50 hover:border-pink-200 transition-all cursor-pointer group">
              {/* Color bar */}
              <div className={`h-1.5 rounded-full ${accentBg} mb-4 opacity-60 group-hover:opacity-100 transition-opacity`} />

              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-gray-800 text-sm leading-tight">{venue.name}</h3>
                <Star size={14} className="text-pink-300 shrink-0 mt-0.5" />
              </div>

              <div className="flex items-center gap-1 text-gray-400 text-xs mb-3">
                <MapPin size={11} />
                <span>{venue.location}</span>
              </div>

              <div className="flex items-center gap-3 text-xs text-gray-400 mb-3">
                <span className="flex items-center gap-1"><Users size={11} />{venue.maxGuestCount ?? '∞'}</span>
                <span className="flex items-center gap-1"><DollarSign size={11} />{venue.minBudget ? `$${venue.minBudget.toLocaleString()}+` : 'Flexible'}</span>
              </div>

              <div className="flex flex-wrap gap-1">
                {venue.occasions.slice(0, 2).map(o => (
                  <span key={o} className={`text-xs px-2 py-0.5 rounded-full font-medium ${occasionColors[o] || 'bg-gray-100 text-gray-500'}`}>
                    {o}
                  </span>
                ))}
                {venue.occasions.length > 2 && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-400">+{venue.occasions.length - 2}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}