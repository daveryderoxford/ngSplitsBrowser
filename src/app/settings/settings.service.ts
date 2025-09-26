import { effect, Injectable, signal } from '@angular/core';
import { DEFAULT_SETTINGS, Settings } from './settings';

const LOCAL_STORAGE_KEY = 'ngSplitsBrowser.settings';

@Injectable({ providedIn: 'root' })
export class SettingsService {
  // Public signal to expose the current settings to other components
  public settings = signal<Settings>(this.loadSettings());

  constructor() {
    effect(() => {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(this.settings()));
    });
  }

  // Loads settings from local storage, merging with defaults
  private loadSettings(): Settings {
    try {
      const storedSettings = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (storedSettings) {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(storedSettings) };
      }
    } catch (e) {
      console.error('Error loading settings from local storage, falling back to defaults:', e);
    }
    return DEFAULT_SETTINGS;
  }

  updateSetting<K extends keyof Settings>(key: K, value: Settings[K]) {
    this.settings.update(currentSettings => ({ ...currentSettings, [key]: value }));
  }
}