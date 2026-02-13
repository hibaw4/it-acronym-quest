import { Injectable } from '@angular/core';
import { Acronym } from '../models/acronym.interface';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private readonly STORAGE_KEY = 'it-acronym-quest-data';

  saveAcronyms(acronyms: Acronym[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(acronyms));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }

  loadAcronyms(): Acronym[] | null {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error loading from localStorage:', error);
      return null;
    }
  }

  clearStorage(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }
}