import { Component, computed, model } from '@angular/core';
import { MazeService } from '../../services/maze.service';
import { Maze } from '../../types/maze.type';
import { Settings } from '../../types/settings.type';
import { SliderComponent } from '../ui/slider/slider.component';
import { Slider } from '../../types/slider.interface';
import { LIMITS } from '../../constants/limits';
import { Size } from '../../types/size.interface';
import { DEFAULT_START } from '../../constants/default-maze';

@Component({
  selector: 'app-controls',
  imports: [SliderComponent],
  templateUrl: './controls.component.html',
  styleUrl: './controls.component.scss',
})
export class ControlsComponent {

  maze = model.required<Maze>();
  settings = model.required<Settings>();
  isGenerated = model.required<boolean>();

  mazeWidth = computed<Slider>(() => ({
    range: LIMITS.mazeWidth,
    step: 1,
    value: this.mazeService.width(this.maze())
  }));

  mazeHeight = computed<Slider>(() => ({
    range: LIMITS.mazeHeight,
    step: 1,
    value: this.mazeService.height(this.maze())
  }));

  blockWidth = computed<Slider>(() => ({
    range: LIMITS.blockWidth,
    step: 2,
    value: this.settings().blockSize.width
  }));

  blockHeight = computed<Slider>(() => ({
    range: LIMITS.blockHeight,
    step: 2,
    value: this.settings().blockSize.height
  }));

  wallThickness = computed<Slider>(() => ({
    range: LIMITS.wallThickness,
    step: 1,
    value: this.settings().wallThickness
  }));
  
  constructor(private mazeService: MazeService) { }

  generateMaze(): void {
    if (this.isGenerated()) {
      this.maze.set(this.mazeService.createMazeSpace(this.mazeService.size(this.maze())));
      this.isGenerated.set(false);
    }
    setTimeout(() => {
      this.isGenerated.set(true);
      this.maze.set(this.mazeService.generateMaze(this.maze(), DEFAULT_START));
    }, 100);
    
  }

  setMazeWidth(width: number): void {
    const newSize: Size = {
      width,
      height: this.mazeService.height(this.maze())
    }
    this.maze.set(this.mazeService.createMazeSpace(newSize));
    this.isGenerated.set(false);
  }

  setMazeHeight(height: number): void {
    const newSize: Size = {
      width: this.mazeService.width(this.maze()),
      height
    }
    this.maze.set(this.mazeService.createMazeSpace(newSize));
    this.isGenerated.set(false);
  }

  setBlockWidth(width: number): void {
    this.settings.update(value => ({
      ...value,
      blockSize: { ...value.blockSize, width }
    }));
  }

  setBlockHeight(height: number): void {
    this.settings.update(value => ({
      ...value,
      blockSize: { ...value.blockSize, height }
    }));
  }

  setWallThickness(wallThickness: number): void {
    this.settings.update(value => ({ ...value, wallThickness }));
  }

}
