import { Component, computed, model, output, signal } from '@angular/core';
import { NgClass } from '@angular/common';
import { timer, take } from 'rxjs';
import { LIMITS } from '../../constants/limits';
import { DEFAULT_MAZE_SIZE } from '../../constants/default-maze-size';
import { DEFAULT_SETTINGS } from '../../constants/default-settings';
import { REDRAW_DELAY_MS } from '../../constants/delays';
import { Size } from '../../types/general/size.interface';
import { Maze } from '../../types/maze.interface';
import { Settings } from '../../types/settings.interface';
import { Slider } from '../../types/ui/slider.interface';
import { ControlsGroupComponent } from '../ui/controls-group/controls-group.component';
import { SliderComponent } from '../ui/slider/slider.component';
import { Checkbox } from '../../types/ui/checkbox.interface';
import { CheckboxComponent } from '../ui/checkbox/checkbox.component';
import { MazeService } from '../../services/maze.service';

@Component({
  selector: 'app-controls',
  imports: [NgClass, ControlsGroupComponent, SliderComponent, CheckboxComponent],
  templateUrl: './controls.component.html',
  styleUrl: './controls.component.scss',
})
export class ControlsComponent {

  maze = model.required<Maze>();
  settings = model.required<Settings>();
  isGenerated = model.required<boolean>();

  save = output<void>();

  mazeWidth = computed<Slider>(() => ({
    name: 'Maze Width',
    range: LIMITS.mazeWidth,
    step: 1,
    value: this.mazeService.width(this.maze())
  }));

  mazeHeight = computed<Slider>(() => ({
    name: 'Maze Height',
    range: LIMITS.mazeHeight,
    step: 1,
    value: this.mazeService.height(this.maze())
  }));

  keepMazeSquare = signal<Checkbox>({
    name: 'Square Maze',
    value: false
  });

  blockWidth = computed<Slider>(() => ({
    name: 'Block Width',
    range: LIMITS.blockWidth,
    step: 2,
    value: this.settings().blockSize.width
  }));

  blockHeight = computed<Slider>(() => ({
    name: 'Block Height',
    range: LIMITS.blockHeight,
    step: 2,
    value: this.settings().blockSize.height
  }));

  keepBlockSquare = signal<Checkbox>({
    name: 'Square Blocks',
    value: false
  });

  wallThickness = computed<Slider>(() => ({
    name: 'Wall Thicknness',
    range: LIMITS.wallThickness,
    step: 1,
    value: this.settings().wallThickness
  }));

  pathThickness = computed<Slider>(() => ({
    name: 'Path Thicknness',
    range: LIMITS.pathThickness,
    step: 2,
    value: this.settings().pathThickness
  }));

  showPaths = computed<Checkbox>(() => ({
    name: 'Show Paths',
    value: this.settings().showPaths
  }));

  showShortestPath = computed<Checkbox>(() => ({
    name: 'Show Shortest Path',
    value: this.settings().showShortestPath
  }));
    
  constructor(private mazeService: MazeService) { }

  generateMaze(): void {
    if (this.isGenerated()) {
      this.maze.set(this.mazeService.createMazeObject(this.mazeService.size(this.maze())));
      this.isGenerated.set(false);
    }
    timer(REDRAW_DELAY_MS).pipe(take(1)).subscribe(() => {
      this.isGenerated.set(true);
      this.maze.set(this.mazeService.generateMaze(this.maze()));
    });
  }

  saveMaze(): void {
    this.save.emit();
  }

  resetMaze(): void {
    this.settings.set({ 
      ...DEFAULT_SETTINGS, 
      blockSize: { ...DEFAULT_SETTINGS.blockSize }
    });
    this.maze.set(this.mazeService.createMazeObject(DEFAULT_MAZE_SIZE));
    this.isGenerated.set(false);
  }

  setMazeWidth(width: number): void {
    const newSize: Size = {
      width,
      height: this.keepMazeSquare().value ? width : this.mazeService.height(this.maze())
    }
    this.maze.set(this.mazeService.createMazeObject(newSize));
    this.isGenerated.set(false);
  }

  setMazeHeight(height: number): void {
    const newSize: Size = {
      width: this.keepMazeSquare().value ? height : this.mazeService.width(this.maze()),
      height
    }
    this.maze.set(this.mazeService.createMazeObject(newSize));
    this.isGenerated.set(false);
  }

  setKeepMazeSquare(value: boolean): void {
    this.keepMazeSquare.update(current => ({ ...current, value }));
  }

  setBlockWidth(width: number): void {
    this.settings.update(value => ({
      ...value,
      blockSize: {
        ...value.blockSize,
        width,
        height: this.keepBlockSquare().value ? width : value.blockSize.height
      }
    }));
  }

  setBlockHeight(height: number): void {
    this.settings.update(value => ({
      ...value,
      blockSize: {
        ...value.blockSize,
        width: this.keepBlockSquare().value ? height : value.blockSize.width,
        height
      }
    }));
  }

  setKeepBlockSquare(value: boolean): void {
    this.keepBlockSquare.update(current => ({ ...current, value }));
  }

  setWallThickness(wallThickness: number): void {
    this.settings.update(value => ({ ...value, wallThickness }));
  }

  setPathThickness(pathThickness: number): void {
    this.settings.update(value => ({ ...value, pathThickness }));
  }

  togglePaths(showPaths: boolean): void {
    this.settings.update(value => ({ ...value, showPaths }));
  }

  toggleShortestPath(showShortestPath: boolean): void {
    this.settings.update(value => ({ ...value, showShortestPath }));
  }

}
