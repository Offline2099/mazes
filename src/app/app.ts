import { Component, Signal, signal, WritableSignal } from '@angular/core';
import { Maze } from './types/maze.type';
import { ControlsComponent } from './components/controls/controls.component';
import { MazeComponent } from './components/maze/maze.component';
import { MazeService } from './services/maze.service';
import { DEFAULT_SIZE, DEFAULT_START } from './constants/default-maze';
import { Settings } from './types/settings.type';
import { DEFAULT_SETTINGS } from './constants/default-settings';


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

  constructor(private mazeService: MazeService) {
    this.maze = this.mazeService.createMazeSpace(DEFAULT_SIZE);
    this.settings = { ...DEFAULT_SETTINGS, blockSize: { ...DEFAULT_SETTINGS.blockSize } };
  }

}
