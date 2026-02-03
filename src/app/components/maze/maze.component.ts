import { Component, computed, effect, ElementRef, input, signal, viewChild } from '@angular/core';
import { Maze } from '../../types/maze.type';
import { Direction } from '../../constants/direction.enum';
import { MazeService } from '../../services/maze.service';
import { Settings } from '../../types/settings.type';
import { Position } from '../../types/position.interface';
import { NgClass } from '@angular/common';

const REDRAW_DELAY_MS: number = 100;

@Component({
  selector: 'app-maze',
  imports: [NgClass],
  templateUrl: './maze.component.html',
  styleUrl: './maze.component.scss',
})
export class MazeComponent {

  maze = input.required<Maze>();
  settings = input.required<Settings>();
  isGenerated = input.required<boolean>();

  canvasRef = viewChild.required<ElementRef>('canvas');

  width = computed<number>(() => this.totalWidth(this.maze(), this.settings()));
  height = computed<number>(() => this.totalHeight(this.maze(), this.settings()));

  isDisplayed = signal<boolean>(true);

  constructor(private mazeService: MazeService) {
    effect(() => {
      this.width();
      this.height();
      this.isGenerated();
      this.isDisplayed.set(false);
      setTimeout(() => {
        this.isDisplayed.set(true);
        this.drawMaze(this.maze(), this.settings(), this.isGenerated());
      }, REDRAW_DELAY_MS);
    });
  }

  totalWidth(maze: Maze, settings: Settings): number {
    const blockCount: number = this.mazeService.width(maze);
    return settings.blockSize.width * blockCount + settings.wallThickness * (blockCount + 1);
  }

  totalHeight(maze: Maze, settings: Settings): number {
    const blockCount: number = this.mazeService.height(maze);
    return settings.blockSize.height * blockCount + settings.wallThickness * (blockCount + 1);
  }

  blockPositionX(settings: Settings, x: number): number {
    return settings.blockSize.width * x + settings.wallThickness * (x + 1);
  }

  blockPositionY(settings: Settings, y: number): number {
    return settings.blockSize.height * y + settings.wallThickness * (y + 1);
  }

  blockCenterX(settings: Settings, x: number): number {
    return this.blockPositionX(settings, x) + settings.blockSize.width / 2;
  }

  blockCenterY(settings: Settings, y: number): number {
    return this.blockPositionY(settings, y) + settings.blockSize.height / 2;
  }

  drawMaze(maze: Maze, settings: Settings, isGenerated: boolean): void {
    const canvas: HTMLCanvasElement = this.canvasRef().nativeElement;
    const ctx: CanvasRenderingContext2D | null = canvas.getContext('2d');
    if (!ctx) return;
    this.drawGrid(maze, settings, canvas, ctx);
    if (isGenerated) {
      this.drawEntrance(settings, ctx);
      this.drawPaths(maze, settings, ctx);
      this.drawExit(maze, settings, ctx);
    }
  }

  drawGrid(maze: Maze, settings: Settings, canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'grey';
    [...Array(this.mazeService.width(maze) + 1).keys()].forEach(index => {
      const x: number = this.blockPositionX(settings, index) - settings.wallThickness;
      ctx.fillRect(x, 0, settings.wallThickness, canvas.height);
    });
    [...Array(this.mazeService.height(maze) + 1).keys()].forEach(index => {
      const y: number = this.blockPositionY(settings, index) - settings.wallThickness;
      ctx.fillRect(0, y, canvas.width, settings.wallThickness);
    });
  }

  drawPaths(maze: Maze, settings: Settings, ctx: CanvasRenderingContext2D): void {
    maze.forEach((column, x) => {
      column.forEach((_, y) => {
        this.maze()[x][y].forEach(dir => {
          switch (dir) {
            case Direction.down:
              ctx.fillStyle = 'black';
              ctx.fillRect(
                this.blockPositionX(settings, x),
                this.blockPositionY(settings, y + 1) - settings.wallThickness,
                settings.blockSize.width,
                settings.wallThickness
              );
              ctx.fillStyle = 'green';
              ctx.fillRect(
                this.blockCenterX(settings, x) - settings.pathThickness / 2,
                this.blockCenterY(settings, y),
                settings.pathThickness,
                settings.blockSize.height + settings.wallThickness
              );
              break;
            case Direction.right:
              ctx.fillStyle = 'black';
              ctx.fillRect(
                this.blockPositionX(settings, x + 1) - settings.wallThickness,
                this.blockPositionY(settings, y),
                settings.wallThickness,
                settings.blockSize.height
              );
              ctx.fillStyle = 'green';
              ctx.fillRect(
                this.blockCenterX(settings, x),
                this.blockCenterY(settings, y) - settings.pathThickness / 2,
                settings.blockSize.width + settings.wallThickness,
                settings.pathThickness
              );
              break;
            default:
              break;
          }
        });
      });
    });
  }

  drawEntrance(settings: Settings, ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, settings.wallThickness, settings.wallThickness, settings.blockSize.height);
    ctx.fillStyle = 'green';
    ctx.fillRect(0, this.blockCenterY(settings, 0) - 1, settings.blockSize.width / 2 + settings.wallThickness, 2);
  }

  drawExit(maze: Maze, settings: Settings, ctx: CanvasRenderingContext2D): void {
    const lastBlock: Position = {
      x: this.blockPositionX(settings, this.mazeService.width(maze) - 1),
      y: this.blockPositionY(settings, this.mazeService.height(maze) - 1)
    };
    ctx.fillStyle = 'black';
    ctx.fillRect(
      lastBlock.x + settings.blockSize.width,
      lastBlock.y,
      settings.wallThickness,
      settings.blockSize.height
    );
    ctx.fillStyle = 'green';
    ctx.fillRect(
      lastBlock.x + settings.blockSize.width / 2,
      lastBlock.y + settings.blockSize.height / 2 - 1,
      settings.blockSize.width + settings.wallThickness,
      2
    );
  }

}
