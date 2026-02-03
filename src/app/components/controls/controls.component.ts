import { Component, computed, model, signal } from '@angular/core';
import { NgClass } from '@angular/common';
import { timer, take } from 'rxjs';
import { LIMITS } from '../../constants/limits';
import { DEFAULT_SIZE, DEFAULT_START } from '../../constants/default-maze';
import { DEFAULT_SETTINGS } from '../../constants/default-settings';
import { REDRAW_DELAY_MS } from '../../constants/delays';
import { Size } from '../../types/size.interface';
import { Maze } from '../../types/maze.type';
import { Settings } from '../../types/settings.type';
import { Slider } from '../../types/slider.interface';
import { Checkbox } from '../../types/checkbox.interface';
import { SliderComponent } from '../ui/slider/slider.component';
import { CheckboxComponent } from '../ui/checkbox/checkbox.component';
import { MazeService } from '../../services/maze.service';

@Component({
  selector: 'app-controls',
  imports: [NgClass, SliderComponent, CheckboxComponent],
  templateUrl: './controls.component.html',
  styleUrl: './controls.component.scss',
})
export class ControlsComponent {

  maze = model.required<Maze>();
  settings = model.required<Settings>();
  isGenerated = model.required<boolean>();

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
    name: 'Square Block',
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
    
  constructor(private mazeService: MazeService) { }

  generateMaze(): void {
    if (this.isGenerated()) {
      this.maze.set(this.mazeService.createMazeSpace(this.mazeService.size(this.maze())));
      this.isGenerated.set(false);
    }
    timer(REDRAW_DELAY_MS).pipe(take(1)).subscribe(() => {
      this.isGenerated.set(true);
      this.maze.set(this.mazeService.generateMaze(this.maze(), DEFAULT_START));
    });
  }

  resetMaze(): void {
    this.settings.set({ 
      ...DEFAULT_SETTINGS, 
      blockSize: { ...DEFAULT_SETTINGS.blockSize }
    });
    this.maze.set(this.mazeService.createMazeSpace(DEFAULT_SIZE));
    this.isGenerated.set(false);
  }

  setMazeWidth(width: number): void {
    const newSize: Size = {
      width,
      height: this.keepMazeSquare().value ? width : this.mazeService.height(this.maze())
    }
    this.maze.set(this.mazeService.createMazeSpace(newSize));
    this.isGenerated.set(false);
  }

  setMazeHeight(height: number): void {
    const newSize: Size = {
      width: this.keepMazeSquare().value ? height : this.mazeService.width(this.maze()),
      height
    }
    this.maze.set(this.mazeService.createMazeSpace(newSize));
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

}
