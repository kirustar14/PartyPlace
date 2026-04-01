import 'dotenv/config';
import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import * as fs from 'fs';
import * as path from 'path';

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

interface ParsedQuery {
  budget?: number;
  guestCount?: number;
  location?: string;
  occasion?: string;
  day?: string;
  time?: string;
}

interface Venue {
  id: number;
  name: string;
  minBudget: number | null;
  maxGuestCount: number | null;
  location: string;
  availableDays: string[];
  openTimes: string[];
  occasions: string[];
}

interface ValidationResult {
  valid: boolean;
  reason?: string;
  suggestion?: string;
}

@Injectable()
export class SearchService {
  private venues: Venue[];

  constructor() {
    const venuesPath = path.join(__dirname, '../../../..', 'venues.json');
    this.venues = JSON.parse(fs.readFileSync(venuesPath, 'utf-8'));
  }

  async search(query: string) {
    // 1. Parse with OpenAI
    const parsed = await this.parseQuery(query);

    // 2. Validate
    const validation = this.validate(parsed);
    if (!validation.valid) {
      return { valid: false, reason: validation.reason, suggestion: validation.suggestion, parsed };
    }

    // 3. Filter venues
    const results = this.filterVenues(parsed);

    return { valid: true, parsed, results };
  }

  private async parseQuery(query: string): Promise<ParsedQuery> {
    const response = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `Extract event details from the user query and return ONLY valid JSON with these fields:
          - budget (number or null): their budget in dollars
          - guestCount (number or null): number of guests
          - location (string or null): NYC neighborhood
          - occasion (string or null): type of event e.g. Birthday, Wedding, etc
          - day (string or null): day of week e.g. Friday, Saturday
          - time (string or null): one of morning/afternoon/evening/night
          Return only JSON, no markdown.`,
        },
        { role: 'user', content: query },
      ],
    });

    const text = response.choices[0].message.content || '{}';
    try {
      return JSON.parse(text);
    } catch {
      return {};
    }
  }

  private validate(parsed: ParsedQuery): ValidationResult {
    // Rule 1: Weekend bookings require min $1500 budget
    const weekendDays = ['Friday', 'Saturday', 'Sunday'];
    if (parsed.day && weekendDays.includes(parsed.day)) {
      if (parsed.budget && parsed.budget < 1500) {
        return {
          valid: false,
          reason: 'Weekend bookings require a minimum budget of $1,500.',
          suggestion: `Try increasing your budget to at least $1,500, or consider a weekday booking.`,
        };
      }
    }

    // Rule 2: Guest count must be reasonable
    if (parsed.guestCount && parsed.guestCount > 150) {
      return {
        valid: false,
        reason: 'No venues available for more than 150 guests.',
        suggestion: 'Try splitting into multiple events or reducing guest count to under 150.',
      };
    }

    // Rule 3: Budget can't be negative or zero
    if (parsed.budget !== undefined && parsed.budget !== null && parsed.budget <= 0) {
      return {
        valid: false,
        reason: 'Budget must be greater than $0.',
        suggestion: 'Please specify a valid budget amount.',
      };
    }

    return { valid: true };
  }

  private filterVenues(parsed: ParsedQuery): Venue[] {
    return this.venues.filter((venue) => {
      if (parsed.budget && venue.minBudget && parsed.budget < venue.minBudget) return false;
      if (parsed.guestCount && venue.maxGuestCount && parsed.guestCount > venue.maxGuestCount) return false;
      if (parsed.location && !venue.location.toLowerCase().includes(parsed.location.toLowerCase())) return false;
      if (parsed.day && !venue.availableDays.includes(parsed.day)) return false;
      if (parsed.time && !venue.openTimes.includes(parsed.time)) return false;
      if (parsed.occasion && !venue.occasions.some(o => o.toLowerCase().includes(parsed.occasion!.toLowerCase()))) return false;
      return true;
    });
  }
}