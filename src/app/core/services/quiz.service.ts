import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { QuizState } from '../models/quiz-state.interface';
import { Acronym } from '../models/acronym.interface';

@Injectable({
  providedIn: 'root'
})
export class QuizService {
  private quizStateSubject = new BehaviorSubject<QuizState>({
    currentQuestion: 0,
    totalQuestions: 10,
    score: 0,
    correctAnswers: 0,
    incorrectAnswers: 0
  });

  public quizState$ = this.quizStateSubject.asObservable();

  private currentAcronyms: Acronym[] = [];
  private shuffledAcronyms: Acronym[] = [];

  initializeQuiz(acronyms: Acronym[], totalQuestions: number = 10): void {
    this.currentAcronyms = acronyms;
    this.shuffledAcronyms = this.shuffleArray([...acronyms]).slice(0, totalQuestions);
    
    this.quizStateSubject.next({
      currentQuestion: 0,
      totalQuestions: Math.min(totalQuestions, acronyms.length),
      score: 0,
      correctAnswers: 0,
      incorrectAnswers: 0
    });
  }

  getCurrentAcronym(): Acronym | undefined {
    const state = this.quizStateSubject.value;
    return this.shuffledAcronyms[state.currentQuestion];
  }

  checkAnswer(answer: string): boolean {
    const currentAcronym = this.getCurrentAcronym();
    if (!currentAcronym) return false;

    const isCorrect = answer.toLowerCase().trim() === 
                      currentAcronym.fullTerm.toLowerCase().trim();
    
    const state = this.quizStateSubject.value;
    this.quizStateSubject.next({
      ...state,
      score: isCorrect ? state.score + 10 : state.score,
      correctAnswers: isCorrect ? state.correctAnswers + 1 : state.correctAnswers,
      incorrectAnswers: !isCorrect ? state.incorrectAnswers + 1 : state.incorrectAnswers
    });

    return isCorrect;
  }

  nextQuestion(): void {
    const state = this.quizStateSubject.value;
    // Toujours incrémenter, même sur la dernière question
    this.quizStateSubject.next({
      ...state,
      currentQuestion: state.currentQuestion + 1
    });
  }

  isQuizComplete(): boolean {
    const state = this.quizStateSubject.value;
    // The quiz is considered complete if we've moved past the last question
    return state.currentQuestion >= state.totalQuestions;
  }

  getHint(type: 'firstLetter' | 'description'): string {
    const currentAcronym = this.getCurrentAcronym();
    if (!currentAcronym) return '';

    if (type === 'firstLetter') {
      return currentAcronym.fullTerm.substring(0, 2);
    } else {
      return currentAcronym.description || 'No description available';
    }
  }

  private shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  resetQuiz(): void {
    // Re-shuffle the acronyms and reset the quiz state
    if (this.currentAcronyms.length > 0) {
      this.shuffledAcronyms = this.shuffleArray([...this.currentAcronyms]).slice(0, 10);
    }
    
    this.quizStateSubject.next({
      currentQuestion: 0,
      totalQuestions: 10,
      score: 0,
      correctAnswers: 0,
      incorrectAnswers: 0
    });
  }

  getQuizState(): QuizState {
    return this.quizStateSubject.value;
  }
}