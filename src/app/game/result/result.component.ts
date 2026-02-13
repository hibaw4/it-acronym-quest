import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { trigger, state, style, transition, animate, query, stagger } from '@angular/animations';
import { QuizService } from '../../core/services/quiz.service';
import { QuizState } from '../../core/models/quiz-state.interface';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.css'],
  animations: [
    // Result card entrance animation
    trigger('resultCardAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.8) translateY(50px)' }),
        animate('600ms cubic-bezier(0.34, 1.56, 0.64, 1)', style({ 
          opacity: 1, 
          transform: 'scale(1) translateY(0)' 
        }))
      ])
    ]),
    // Stats cards stagger animation
    trigger('statsAnimation', [
      transition(':enter', [
        query('.stat-card', [
          style({ opacity: 0, transform: 'translateY(30px)' }),
          stagger(100, [
            animate('400ms cubic-bezier(0.34, 1.56, 0.64, 1)', style({ 
              opacity: 1, 
              transform: 'translateY(0)' 
            }))
          ])
        ])
      ])
    ]),
    // Title animation
    trigger('titleAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-30px)' }),
        animate('500ms ease-out', style({ 
          opacity: 1, 
          transform: 'translateY(0)' 
        }))
      ])
    ]),
    // Percentage circle animation
    trigger('circleAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0)' }),
        animate('800ms cubic-bezier(0.34, 1.56, 0.64, 1)', style({ 
          opacity: 1, 
          transform: 'scale(1)' 
        }))
      ])
    ]),
    // Button animation
    trigger('buttonAnimation', [
      transition(':enter', [
        query('button', [
          style({ opacity: 0, transform: 'translateY(20px)' }),
          stagger(100, [
            animate('400ms ease-out', style({ 
              opacity: 1, 
              transform: 'translateY(0)' 
            }))
          ])
        ])
      ])
    ])
  ],
  standalone: false
})
export class ResultComponent implements OnInit {
  quizState?: QuizState;

  constructor(
    private quizService: QuizService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.quizState = this.quizService.getQuizState();
  }

  playAgain(): void {
    this.quizService.resetQuiz();
    this.router.navigate(['/game/quiz']);
  }

  get percentage(): number {
    if (!this.quizState) return 0;
    return (this.quizState.correctAnswers / this.quizState.totalQuestions) * 100;
  }

  get performanceMessage(): string {
    const pct = this.percentage;
    if (pct >= 90) return '🏆 Excellent! You\'re an IT expert!';
    if (pct >= 70) return '🎉 Great job! Keep it up!';
    if (pct >= 50) return '👍 Good effort! Practice makes perfect!';
    return '💪 Keep learning! You\'ll do better next time!';
  }
}