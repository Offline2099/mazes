import { Component, inject, model, output } from '@angular/core';
import * as CONTROLS from '../../constants/controls';
import { DEFAULT_SETTINGS } from '../../constants/default-settings';
import { Maze } from '../../types/maze.interface';
import { Settings } from '../../types/settings.interface';
import { ControlsGroupComponent } from '../ui/controls-group/controls-group.component';
import { SliderComponent } from '../ui/slider/slider.component';
import { CheckboxComponent } from '../ui/checkbox/checkbox.component';
import { MazeService } from '../../services/maze.service';

@Component({
  selector: 'app-controls',
  imports: [ControlsGroupComponent, SliderComponent, CheckboxComponent],
  templateUrl: './controls.component.html',
  styleUrl: './controls.component.scss'
})
export class ControlsComponent {

  readonly CONTROLS = CONTROLS;

  private mazeService = inject(MazeService);

  maze = model.required<Maze>();
  settings = model.required<Settings>();
  isGenerated = model.required<boolean>();

  save = output<void>();

  generateMaze(): void {
    if (this.isGenerated())
      this.maze.set(this.mazeService.createMazeObject(this.settings().mazeSize));
    this.isGenerated.set(true);
    this.maze.set(this.mazeService.generateMaze(this.maze()));
  }

  resetMaze(): void {
    this.settings.set(DEFAULT_SETTINGS);
    this.maze.set(this.mazeService.createMazeObject());
    this.isGenerated.set(false);
  }

  setMazeWidth(width: number): void {
    const height = this.settings().keepMazeSquare
      ? width
      : this.mazeService.currentHeight(this.maze());
    this.settings.update(settings => ({ ...settings, mazeSize: { width, height } }));
    this.maze.set(this.mazeService.createMazeObject({ width, height }));
    this.isGenerated.set(false);
  }

  setMazeHeight(height: number): void {
    const width = this.settings().keepMazeSquare
      ? height
      : this.mazeService.currentWidth(this.maze());
    this.settings.update(settings => ({ ...settings, mazeSize: { width, height } }));
    this.maze.set(this.mazeService.createMazeObject({ width, height }));
    this.isGenerated.set(false);
  }

  setKeepMazeSquare(keepMazeSquare: boolean): void {
    this.settings.update(settings => ({ ...settings, keepMazeSquare }));
  }

  setBlockWidth(width: number): void {
    const height = this.settings().keepBlocksSquare ? width : this.settings().blockSize.height;
    this.settings.update(settings => ({ ...settings, blockSize: { width, height } }));
  }

  setBlockHeight(height: number): void {
    const width = this.settings().keepBlocksSquare ? height : this.settings().blockSize.width;
    this.settings.update(settings => ({ ...settings, blockSize: { width, height } }));
  }

  setKeepBlockSquare(keepBlocksSquare: boolean): void {
    this.settings.update(settings => ({ ...settings, keepBlocksSquare }));
  }

  setWallThickness(wallThickness: number): void {
    this.settings.update(settings => ({ ...settings, wallThickness }));
  }

  setPathThickness(pathThickness: number): void {
    this.settings.update(settings => ({ ...settings, pathThickness }));
  }

  togglePaths(showPaths: boolean): void {
    this.settings.update(settings => ({ ...settings, showPaths }));
  }

  toggleShortestPath(showShortestPath: boolean): void {
    this.settings.update(settings => ({ ...settings, showShortestPath }));
  }

  saveMaze(): void {
    this.save.emit();
  }

}
