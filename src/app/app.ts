import { Component, viewChild } from '@angular/core';
import { DEFAULT_MAZE_SIZE } from './constants/default-maze-size';
import { DEFAULT_SETTINGS } from './constants/default-settings';
import { Maze } from './types/maze.interface';
import { Settings } from './types/settings.interface';
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

  maze: Maze;
  settings: Settings;
  isGenerated: boolean = false;

  mazeComponent = viewChild(MazeComponent);

  constructor(private mazeService: MazeService) {
    this.maze = this.mazeService.createMazeObject(DEFAULT_MAZE_SIZE);
    this.settings = { 
      ...DEFAULT_SETTINGS, 
      blockSize: { ...DEFAULT_SETTINGS.blockSize }
    };
  }

  saveMaze(): void {
    this.mazeComponent()?.saveMaze();
  }

}
