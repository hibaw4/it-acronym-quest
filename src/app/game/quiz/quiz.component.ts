import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { trigger, state, style, transition, animate, query, stagger } from '@angular/animations';
import { DataService } from '../../core/services/data.service';
import { QuizService } from '../../core/services/quiz.service';
import { Acronym } from '../../core/models/acronym.interface';
import { QuizState } from '../../core/models/quiz-state.interface';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.css'],
  animations: [
    // Feedback animation - slide in from top with fade
    trigger('feedbackAnimation', [
      transition(':enter', [
        style({
          opacity: 0,
          transform: 'translateY(-20px) scale(0.95)'
        }),
        animate('400ms cubic-bezier(0.34, 1.56, 0.64, 1)', style({
          opacity: 1,
          transform: 'translateY(0) scale(1)'
        }))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({
          opacity: 0,
          transform: 'translateY(-20px) scale(0.95)'
        }))
      ])
    ]),
    // Question card animation - fade and slide
    trigger('questionAnimation', [
      transition('* => *', [
        style({ opacity: 0, transform: 'translateX(30px) scale(0.9)' }),
        animate('500ms cubic-bezier(0.34, 1.56, 0.64, 1)', style({ 
          opacity: 1, 
          transform: 'translateX(0) scale(1)' 
        }))
      ])
    ]),
    // Next button slide in
    trigger('nextButtonAnimation', [
      transition(':enter', [
        style({
          opacity: 0,
          transform: 'translateY(20px)'
        }),
        animate('400ms cubic-bezier(0.34, 1.56, 0.64, 1)', style({
          opacity: 1,
          transform: 'translateY(0)'
        }))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({
          opacity: 0,
          transform: 'translateY(20px)'
        }))
      ])
    ]),
    // Hint animation
    trigger('hintAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(-20px)' }),
        animate('300ms ease-out', style({ 
          opacity: 1, 
          transform: 'translateX(0)' 
        }))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ 
          opacity: 0, 
          transform: 'translateX(-20px)' 
        }))
      ])
    ])
  ],
  standalone: false
})
export class QuizComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  currentAcronym?: Acronym;
  quizState?: QuizState;
  answerControl = new FormControl('', [Validators.required]);
  
  feedback: { show: boolean; correct: boolean; message: string } = {
    show: false,
    correct: false,
    message: ''
  };

  showHint = false;
  hint = '';
  isProcessing = false;

  constructor(
    private dataService: DataService,
    private quizService: QuizService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.dataService.getAcronyms()
      .pipe(takeUntil(this.destroy$))
      .subscribe(acronyms => {
        if (acronyms.length > 0) {
          this.quizService.initializeQuiz(acronyms, 10);
          this.loadCurrentQuestion();
        }
      });

    this.quizService.quizState$
      .pipe(takeUntil(this.destroy$))
      .subscribe(state => {
        this.quizState = state;
        this.cdr.detectChanges(); // Force change detection
      });
  }

  loadCurrentQuestion(): void {
    const state = this.quizService.getQuizState();
    this.quizState = state; // Update local reference
    
    // Check if quiz is complete before trying to load
    if (state.currentQuestion >= state.totalQuestions) {
      this.router.navigate(['/game/result']);
      return;
    }
    
    const acronym = this.quizService.getCurrentAcronym();
    if (!acronym) {
      // If no acronym found, quiz might be complete
      if (this.quizService.isQuizComplete()) {
        this.router.navigate(['/game/result']);
      }
      return;
    }
    
    this.currentAcronym = acronym;
    this.answerControl.reset();
    this.answerControl.enable();
    this.feedback.show = false;
    this.showHint = false;
    this.isProcessing = false;
    
    // Force change detection
    this.cdr.detectChanges();
  }

  submitAnswer(event?: Event): void {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    if (this.answerControl.invalid || this.isProcessing || this.feedback.show) {
      return;
    }

    this.isProcessing = true;
    this.answerControl.disable();

    const answer = this.answerControl.value?.trim() || '';
    const isCorrect = this.quizService.checkAnswer(answer);

    // Update feedback
    this.feedback = {
      show: true,
      correct: isCorrect,
      message: isCorrect 
        ? 'Correct!' 
        : `Incorrect. The answer was: ${this.currentAcronym?.fullTerm}`
    };
    
    // Force change detection to show feedback immediately
    this.cdr.detectChanges();
    
    // Also update quizState reference to trigger progress bar update
    this.quizState = this.quizService.getQuizState();
    this.cdr.detectChanges();
  }

  nextQuestion(): void {
    if (!this.feedback.show) return; // Only allow if feedback is shown
    
    // First, hide feedback and reset state
    this.feedback.show = false;
    
    // Move to the next question
    this.quizService.nextQuestion();
    
    // Get the updated state after incrementing
    const updatedState = this.quizService.getQuizState();
    this.quizState = updatedState; // Update local reference
    
    // Check if quiz is complete (after incrementing, currentQuestion might be >= totalQuestions)
    if (updatedState.currentQuestion >= updatedState.totalQuestions) {
      // Quiz is complete, navigate to results
      this.router.navigate(['/game/result']);
    } else {
      // Load the next question
      this.loadCurrentQuestion();
    }
    
    // Force change detection
    this.cdr.detectChanges();
  }

  getHint(type: 'firstLetter' | 'description'): void {
    this.hint = this.quizService.getHint(type);
    this.showHint = true;
  }

  get progress(): number {
    if (!this.quizState || this.quizState.totalQuestions === 0) return 0;
    // Calculate progress based on current question (0-indexed)
    // If on question 0, show 10% (1/10), if on question 1, show 20% (2/10), etc.
    return ((this.quizState.currentQuestion + 1) / this.quizState.totalQuestions) * 100;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}