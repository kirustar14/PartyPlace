'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, MapPin, Users, DollarSign, Clock, Tag, AlertCircle, Sparkles, Filter } from 'lucide-react';

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
  const [query, setQuery] = useState('');
  const [valid, setValid] = useState(true);
  const [reason, setReason] = useState('');
  const [suggestion, setSuggestion] = useState('');
  const [parsed, setParsed] = useState<ParsedQuery>({});
  const [results, setResults] = useState<Venue[]>([]);

  useEffect(() => {
    const raw = localStorage.getItem('searchResults');
    if (!raw) { router.push('/'); return; }
    const data = JSON.parse(raw);
    setQuery(data.query || '');
    setValid(data.valid ?? true);
    setReason(data.reason || '');
    setSuggestion(data.suggestion || '');
    setParsed(data.parsed || {});
    setResults(data.results || []);
  }, []);

  const filterLabels: Record<string, { label: string; value: string; icon: any }> = {
    budget: { label: 'Budget', value: parsed?.budget ? `$${parsed.budget.toLocaleString()}` : '', icon: DollarSign },
    guestCount: { label: 'Guests', value: parsed?.guestCount ? `${parsed.guestCount} people` : '', icon: Users },
    location: { label: 'Location', value: parsed?.location || '', icon: MapPin },
    occasion: { label: 'Occasion', value: parsed?.occasion || '', icon: Tag },
    day: { label: 'Day', value: parsed?.day || '', icon: Clock },
    time: { label: 'Time', value: parsed?.time || '', icon: Clock },
  };

  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-gray-100 px-8 py-4 flex items-center justify-between">
        <button onClick={() => router.push('/')} className="flex items-center gap-2 text-gray-500 hover:text-pink-500 transition-colors">
          <ArrowLeft size={16} />
          <span className="text-sm">Back</span>
        </button>
        <span className={`text-xl font-bold ${gradientText}`}>PartyPlace</span>
        <span className="text-sm text-gray-400">{results.length} results</span>
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

        {/* Filters — read only */}
        {parsed && Object.values(filterLabels).some(f => f.value) && (
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <Filter size={14} className="text-gray-400" />
              <span className="text-sm font-semibold text-gray-600">Applied Filters</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {Object.entries(filterLabels).map(([key, { label, value, icon: Icon }]) => {
                if (!value) return null;
                return (
                  <div
                    key={key}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-gradient-to-r from-pink-400 to-purple-500 text-white"
                  >
                    <Icon size={12} />
                    {label}: {value}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Results */}
        {valid && results.length > 0 ? (
          <>
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              {results.length} matching venue{results.length !== 1 ? 's' : ''}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {results.map((venue: Venue) => (
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
                    {venue.occasions?.map((o: string) => (
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
          <p className="text-gray-400 text-sm mb-3">No venues matched these filters:</p>
          <div className="flex flex-wrap gap-2 justify-center mb-6">
            {Object.entries(filterLabels).map(([key, { label, value, icon: Icon }]) => {
              if (!value) return null;
              return (
                <div key={key} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-gradient-to-r from-pink-400 to-purple-500 text-white">
                  <Icon size={12} />
                  {label}: {value}
                </div>
              );
            })}
          </div>
          <button onClick={() => router.push('/')} className={`${accentBg} text-white px-5 py-2 rounded-xl text-sm`}>
            New Search
          </button>
        </div>


        ) : null}
      </div>
    </main>
  );
}