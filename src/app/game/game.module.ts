import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GameRoutingModule } from './game-routing.module';
import { GameComponent } from './game.component';
import { QuizComponent } from './quiz/quiz.component';
import { ResultComponent } from './result/result.component';


@NgModule({
  declarations: [
    GameComponent,
    QuizComponent,
    ResultComponent
  ],
  imports: [
    CommonModule,
    GameRoutingModule
  ]
})
export class GameModule { }
