import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
import { Acronym } from '../models/acronym.interface';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private acronymsSubject = new BehaviorSubject<Acronym[]>([]);
  public acronyms$ = this.acronymsSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadAcronyms();
  }

  private loadAcronyms(): void {
    this.http.get<Acronym[]>('assets/data/acronyms.json')
      .pipe(
        tap(acronyms => this.acronymsSubject.next(acronyms)),
        catchError(error => {
          console.error('Error loading acronyms:', error);
          return of([]);
        })
      )
      .subscribe();
  }

  getAcronyms(): Observable<Acronym[]> {
    return this.acronyms$;
  }

  getAcronymById(id: string): Observable<Acronym | undefined> {
    return this.acronyms$.pipe(
      map(acronyms => acronyms.find(a => a.id === id))
    );
  }

  addAcronym(acronym: Acronym): Observable<Acronym> {
    const currentAcronyms = this.acronymsSubject.value;
    const newAcronym = { ...acronym, id: Date.now().toString() };
    this.acronymsSubject.next([...currentAcronyms, newAcronym]);
    return of(newAcronym);
  }

  updateAcronym(acronym: Acronym): Observable<Acronym> {
    const currentAcronyms = this.acronymsSubject.value;
    const index = currentAcronyms.findIndex(a => a.id === acronym.id);
    if (index !== -1) {
      currentAcronyms[index] = acronym;
      this.acronymsSubject.next([...currentAcronyms]);
    }
    return of(acronym);
  }

  deleteAcronym(id: string): Observable<boolean> {
    const currentAcronyms = this.acronymsSubject.value;
    const filtered = currentAcronyms.filter(a => a.id !== id);
    this.acronymsSubject.next(filtered);
    return of(true);
  }
}