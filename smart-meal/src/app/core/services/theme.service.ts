import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private themeSignal = signal<'light' | 'dark'>('dark');
  
  theme = this.themeSignal.asReadonly();

  constructor() {
    this.loadTheme();
  }

  private loadTheme(): void {
    const stored = localStorage.getItem('smart-meal-theme');
    if (stored === 'light' || stored === 'dark') {
      this.setTheme(stored);
    } else {
      // Detect system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.setTheme(prefersDark ? 'dark' : 'light');
    }
  }

  toggleTheme(): void {
    const newTheme = this.themeSignal() === 'dark' ? 'light' : 'dark';
    this.setTheme(newTheme);
  }

  private setTheme(theme: 'light' | 'dark'): void {
    this.themeSignal.set(theme);
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('smart-meal-theme', theme);
  }
}