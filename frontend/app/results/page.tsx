'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, MapPin, Users, DollarSign, Clock, Tag, X, AlertCircle, Sparkles, Filter } from 'lucide-react';

const accentBg = "bg-gradient-to-r from-pink-400 to-purple-500";
const gradientText = "bg-gradient-to-r from-pink-400 to-purple-500 bg-clip-text text-transparent";

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
};

interface Venue {
  id: number;
  name: string;
  location: string;
  maxGuestCount: number | null;
  minBudget: number | null;
  occasions: string[];
  openTimes: string[];
  availableDays: string[];
}

interface ParsedQuery {
  budget?: number;
  guestCount?: number;
  location?: string;
  occasion?: string;
  day?: string;
  time?: string;
}

export default function Results() {
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [activeFilters, setActiveFilters] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const raw = localStorage.getItem('searchResults');
    if (!raw) { router.push('/'); return; }
    const parsed = JSON.parse(raw);
    setData(parsed);
    // Initialize active filters from parsed query
    if (parsed.parsed) {
      const filters: Record<string, boolean> = {};
      Object.entries(parsed.parsed).forEach(([k, v]) => { if (v) filters[k] = true; });
      setActiveFilters(filters);
    }
  }, []);

  if (!data) return null;

  const { query, valid, reason, suggestion, parsed, results } = data;

  const filterLabels: Record<string, { label: string; value: string; icon: any }> = {
    budget: { label: 'Budget', value: parsed?.budget ? `$${parsed.budget.toLocaleString()}` : '', icon: DollarSign },
    guestCount: { label: 'Guests', value: parsed?.guestCount ? `${parsed.guestCount} people` : '', icon: Users },
    location: { label: 'Location', value: parsed?.location || '', icon: MapPin },
    occasion: { label: 'Occasion', value: parsed?.occasion || '', icon: Tag },
    day: { label: 'Day', value: parsed?.day || '', icon: Clock },
    time: { label: 'Time', value: parsed?.time || '', icon: Clock },
  };

  const toggleFilter = (key: string) => {
    setActiveFilters(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const clearAll = () => {
    const cleared: Record<string, boolean> = {};
    Object.keys(activeFilters).forEach(k => cleared[k] = false);
    setActiveFilters(cleared);
  };

  // Re-filter based on active filters
  const filteredResults = (results || []).filter((venue: Venue) => {
    if (activeFilters.budget && parsed?.budget && venue.minBudget && parsed.budget < venue.minBudget) return false;
    if (activeFilters.guestCount && parsed?.guestCount && venue.maxGuestCount && parsed.guestCount > venue.maxGuestCount) return false;
    if (activeFilters.location && parsed?.location && !venue.location.toLowerCase().includes(parsed.location.toLowerCase())) return false;
    if (activeFilters.day && parsed?.day && !venue.availableDays?.includes(parsed.day)) return false;
    if (activeFilters.time && parsed?.time && !venue.openTimes?.includes(parsed.time)) return false;
    if (activeFilters.occasion && parsed?.occasion && !venue.occasions?.some((o: string) => o.toLowerCase().includes(parsed.occasion.toLowerCase()))) return false;
    return true;
  });

  const activeFilterCount = Object.values(activeFilters).filter(Boolean).length;

  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-gray-100 px-8 py-4 flex items-center justify-between">
        <button onClick={() => router.push('/')} className="flex items-center gap-2 text-gray-500 hover:text-pink-500 transition-colors">
          <ArrowLeft size={16} />
          <span className="text-sm">Back</span>
        </button>
        <span className={`text-xl font-bold ${gradientText}`}>PartyPlace</span>
        <span className="text-sm text-gray-400">{filteredResults?.length || 0} results</span>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Query display */}
        <div className="bg-gradient-to-r from-pink-50 to-purple-50 border border-pink-100 rounded-2xl p-5 mb-6">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles size={14} className="text-pink-400" />
            <span className="text-xs font-semibold text-pink-500 uppercase tracking-wide">Your Search</span>
          </div>
          <p className="text-gray-700 font-medium">"{query}"</p>
        </div>

        {/* Invalid state */}
        {!valid && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-5 mb-6">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle size={16} className="text-red-400" />
              <span className="font-semibold text-red-600">Request Issue</span>
            </div>
            <p className="text-red-500 text-sm mb-3">{reason}</p>
            {suggestion && (
              <div className="bg-white rounded-xl p-3 border border-red-100">
                <p className="text-xs text-gray-500 mb-1">💡 Suggestion</p>
                <p className="text-sm text-gray-700">{suggestion}</p>
              </div>
            )}
          </div>
        )}

        {/* Filters */}
        {parsed && Object.keys(parsed).some(k => parsed[k]) && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Filter size={14} className="text-gray-400" />
                <span className="text-sm font-semibold text-gray-600">Applied Filters</span>
                {activeFilterCount > 0 && (
                  <span className={`text-xs px-2 py-0.5 rounded-full ${accentBg} text-white`}>{activeFilterCount}</span>
                )}
              </div>
              <button onClick={clearAll} className="text-xs text-gray-400 hover:text-pink-500 transition-colors flex items-center gap-1">
                <X size={12} /> Clear all
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {Object.entries(filterLabels).map(([key, { label, value, icon: Icon }]) => {
                if (!value) return null;
                const isActive = activeFilters[key];
                return (
                  <button
                    key={key}
                    onClick={() => toggleFilter(key)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-pink-400 to-purple-500 text-white border-transparent shadow-sm'
                        : 'bg-white text-gray-400 border-gray-200 line-through'
                    }`}
                  >
                    <Icon size={12} />
                    {label}: {value}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Results grid */}
        {valid && filteredResults && filteredResults.length > 0 ? (
          <>
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              {filteredResults.length} matching venue{filteredResults.length !== 1 ? 's' : ''}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredResults.map((venue: Venue) => (
                <div key={venue.id} className="bg-white border border-gray-100 rounded-2xl p-5 hover:shadow-md hover:shadow-pink-50 hover:border-pink-200 transition-all">
                  <div className={`h-1.5 rounded-full ${accentBg} mb-4`} />
                  <h3 className="font-semibold text-gray-800 mb-1">{venue.name}</h3>
                  <div className="flex items-center gap-1 text-gray-400 text-xs mb-3">
                    <MapPin size={11} /><span>{venue.location}</span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-400 mb-3">
                    <span className="flex items-center gap-1"><Users size={11} />{venue.maxGuestCount ?? '∞'} max</span>
                    <span className="flex items-center gap-1"><DollarSign size={11} />{venue.minBudget ? `$${venue.minBudget.toLocaleString()}+` : 'Flexible'}</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-400 mb-3">
                    <Clock size={11} />
                    <span>{venue.openTimes?.join(', ')}</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {venue.occasions?.map(o => (
                      <span key={o} className={`text-xs px-2 py-0.5 rounded-full font-medium ${occasionColors[o] || 'bg-gray-100 text-gray-500'}`}>{o}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : valid ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">No venues found</h3>
            <p className="text-gray-400 text-sm">Try adjusting your filters or search with different criteria</p>
            <button onClick={() => router.push('/')} className={`mt-4 ${accentBg} text-white px-5 py-2 rounded-xl text-sm`}>
              New Search
            </button>
          </div>
        ) : null}
      </div>
    </main>
  );
}