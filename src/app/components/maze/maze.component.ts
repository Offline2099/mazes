import { Component, ElementRef, viewChild, signal, input, computed, effect } from '@angular/core';
import { NgClass } from '@angular/common';
import { timer, take } from 'rxjs';
import { Direction } from '../../constants/direction.enum';
import { BG_COLOR, WALL_COLOR, PATH_COLOR } from '../../constants/default-colors';
import { REDRAW_DELAY_MS } from '../../constants/delays';
import { Position } from '../../types/general/position.interface';
import { Maze } from '../../types/maze.type';
import { Settings } from '../../types/settings.interface';
import { UtilityService } from '../../services/utility.service';
import { MazeService } from '../../services/maze.service';

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

  constructor(
    private container: ElementRef,
    private utility: UtilityService,
    private mazeService: MazeService
  ) {
    effect(() => {
      this.maze();
      this.settings();
      this.isGenerated();
      this.isDisplayed.set(false);
      timer(REDRAW_DELAY_MS).pipe(take(1)).subscribe(() => {
        this.isDisplayed.set(true);
        this.drawMaze(this.maze(), this.settings(), this.isGenerated());
      });
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
      this.drawWays(maze, settings, ctx);
      this.drawExit(maze, settings, ctx);
    }
  }

  drawGrid(maze: Maze, settings: Settings, canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = BG_COLOR;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = WALL_COLOR;
    [...Array(this.mazeService.width(maze) + 1).keys()].forEach(index => {
      const x: number = this.blockPositionX(settings, index) - settings.wallThickness;
      ctx.fillRect(x, 0, settings.wallThickness, canvas.height);
    });
    [...Array(this.mazeService.height(maze) + 1).keys()].forEach(index => {
      const y: number = this.blockPositionY(settings, index) - settings.wallThickness;
      ctx.fillRect(0, y, canvas.width, settings.wallThickness);
    });
  }

  drawWays(maze: Maze, settings: Settings, ctx: CanvasRenderingContext2D): void {
    maze.forEach((column, x) => {
      column.forEach((_, y) => {
        this.maze()[x][y].forEach(direction => {
          switch (direction) {
            case Direction.down:
              this.removeWallSegmentDown(settings, { x, y }, ctx);
              if (settings.showPaths) this.drawPathSegmentDown(settings, { x, y }, ctx);
              break;
            case Direction.right:
              this.removeWallSegmentRight(settings, { x, y }, ctx);
              if (settings.showPaths) this.drawPathSegmentRight(settings, { x, y }, ctx);
              break;
            default:
              break;
          }
        });
      });
    });
  }

  removeWallSegmentDown(settings: Settings, position: Position, ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = BG_COLOR;
    ctx.fillRect(
      this.blockPositionX(settings, position.x),
      this.blockPositionY(settings, position.y + 1) - settings.wallThickness,
      settings.blockSize.width,
      settings.wallThickness
    );
  }

  drawPathSegmentDown(settings: Settings, position: Position, ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = PATH_COLOR;
    ctx.fillRect(
      this.blockCenterX(settings, position.x) - settings.pathThickness / 2,
      this.blockCenterY(settings, position.y) - settings.pathThickness / 2,
      settings.pathThickness,
      settings.blockSize.height + settings.wallThickness + settings.pathThickness
    );
  }

  removeWallSegmentRight(settings: Settings, position: Position, ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = BG_COLOR;
    ctx.fillRect(
      this.blockPositionX(settings, position.x + 1) - settings.wallThickness,
      this.blockPositionY(settings, position.y),
      settings.wallThickness,
      settings.blockSize.height
    );
  }

  drawPathSegmentRight(settings: Settings, position: Position, ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = PATH_COLOR;
    ctx.fillRect(
      this.blockCenterX(settings, position.x) - settings.pathThickness / 2,
      this.blockCenterY(settings, position.y) - settings.pathThickness / 2,
      settings.blockSize.width + settings.wallThickness + settings.pathThickness,
      settings.pathThickness
    );
  }

  drawEntrance(settings: Settings, ctx: CanvasRenderingContext2D): void {
    this.removeWallSegmentRight(settings, { x: -1, y: 0 }, ctx);
    if (!settings.showPaths) return;
    ctx.fillStyle = PATH_COLOR;
    ctx.fillRect(
      0,
      this.blockCenterY(settings, 0) - settings.pathThickness / 2,
      settings.blockSize.width / 2 + settings.wallThickness,
      settings.pathThickness
    );
  }

  drawExit(maze: Maze, settings: Settings, ctx: CanvasRenderingContext2D): void {
    const lastBlockPosition : Position = {
      x: this.mazeService.width(maze) - 1,
      y: this.mazeService.height(maze) - 1
    }
    this.removeWallSegmentRight(settings, lastBlockPosition, ctx);
    if (!settings.showPaths) return;
    ctx.fillStyle = PATH_COLOR;
    ctx.fillRect(
      this.blockPositionX(settings, lastBlockPosition.x) + settings.blockSize.width / 2,
      this.blockPositionY(settings, lastBlockPosition.y) 
        + settings.blockSize.height / 2 - settings.pathThickness / 2,
      settings.blockSize.width + settings.wallThickness,
      settings.pathThickness
    );
  }

  saveMaze(): void {
    this.utility.downloadAsPNG(
      this.canvasRef().nativeElement,
      this.container.nativeElement,
      'maze'
    );
  }

}
