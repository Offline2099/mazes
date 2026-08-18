import { Component, inject, viewChild } from '@angular/core';
import { DEFAULT_SETTINGS } from './constants/default-settings';
import { ControlsComponent } from './components/controls/controls.component';
import { MazeComponent } from './components/maze/maze.component';
import { MazeService } from './services/maze.service';

@Component({
  selector: 'app-root',
  imports: [ControlsComponent, MazeComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {

  private mazeService = inject(MazeService);

  mazeComponent = viewChild.required(MazeComponent);

  maze = this.mazeService.createMazeObject();
  settings = DEFAULT_SETTINGS;
  isGenerated = false;

  saveMaze(): void {
    this.mazeComponent().saveMaze();
  }

}
