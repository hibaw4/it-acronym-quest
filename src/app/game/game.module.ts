import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { GameRoutingModule } from './game-routing.module';
import { SharedModule } from '../shared/shared.module';

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
    SharedModule,
    GameRoutingModule,
    ReactiveFormsModule
  ]
})
export class GameModule { }