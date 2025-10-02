import { Injectable, signal, computed } from '@angular/core';
import { WeightEntry } from '../models/weight.model';

@Injectable({
  providedIn: 'root'
})
export class WeightTrackerService {
  private entriesSignal = signal<WeightEntry[]>([]);

  entries = computed(() => 
    [...this.entriesSignal()].sort((a, b) => a.date.getTime() - b.date.getTime())
  );

  latestEntry = computed(() => {
    const sorted = this.entries();
    return sorted.length > 0 ? sorted[sorted.length - 1] : null;
  });

  weightChange = computed(() => {
    const sorted = this.entries();
    if (sorted.length < 2) return null;
    
    const first = sorted[0].weight;
    const latest = sorted[sorted.length - 1].weight;
    return {
      absolute: Number((latest - first).toFixed(1)),
      percentage: Number((((latest - first) / first) * 100).toFixed(1))
    };
  });

  constructor() {
    this.loadFromStorage();
  }

  addEntry(weight: number, date: Date = new Date(), notes?: string): void {
    const entry: WeightEntry = {
      id: Date.now().toString(),
      date,
      weight,
      notes
    };
    
    this.entriesSignal.update(entries => {
      const updated = [...entries, entry];
      this.saveToStorage(updated);
      return updated;
    });
  }

  deleteEntry(id: string): void {
    this.entriesSignal.update(entries => {
      const updated = entries.filter(e => e.id !== id);
      this.saveToStorage(updated);
      return updated;
    });
  }

  private saveToStorage(entries: WeightEntry[]): void {
    const serialized = entries.map(e => ({
      ...e,
      date: e.date.toISOString()
    }));
    localStorage.setItem('smart-meal-weight', JSON.stringify(serialized));
  }

  private loadFromStorage(): void {
    const stored = localStorage.getItem('smart-meal-weight');
    if (!stored) return;

    try {
      const parsed = JSON.parse(stored);
      const entries = parsed.map((e: any) => ({
        ...e,
        date: new Date(e.date)
      }));
      this.entriesSignal.set(entries);
    } catch (error) {
      console.error('Error loading weight entries', error);
    }
  }
}