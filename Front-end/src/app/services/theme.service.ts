import { Injectable, effect } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  constructor() {
    // Always apply dark theme
    effect(() => {
      document.body.className = document.body.className
        .replace(/theme-\w+/g, '')
        .trim();
      document.body.classList.add('theme-dark');
    });
  }

  /**
   * Check if current theme is dark (always true)
   */
  isDarkMode(): boolean {
    return true;
  }
}

