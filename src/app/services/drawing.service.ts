import { Service, inject } from '@angular/core';
import { Position } from '../types/general/position.interface';
import { Maze } from '../types/maze.interface';
import { Settings } from '../types/settings.interface';
import { MazeService } from './maze.service';
import { Direction } from '../constants/direction.enum';
import { GeometryService } from './geometry.service';

const BG_COLOR: string = 'black';
const WALL_COLOR: string = 'dimgrey';
const PATH_COLOR: string = 'darkgreen';
const SHORTEST_PATH_COLOR: string = 'teal';

type Ctx = CanvasRenderingContext2D;

interface PositionData extends Position {
  isOnShortestPath: boolean;
  isSegmentOnShortestPath: {
    [Direction.right]: boolean;
    [Direction.down]: boolean;
  };
}

@Service()
export class DrawingService {

  private mazeService = inject(MazeService);
  private geometry = inject(GeometryService);

  drawMaze(maze: Maze, settings: Settings, isGenerated: boolean, ctx: Ctx): void {
    this.drawGrid(settings, ctx);
    if (!isGenerated) return;
    this.drawEntrance(settings, ctx);
    this.drawWays(maze, settings, ctx);
    this.drawExit(maze, settings, ctx);
  }

  private drawGrid(settings: Settings, ctx: Ctx): void {
    ctx.fillStyle = BG_COLOR;
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.fillStyle = WALL_COLOR;
    [...Array(settings.mazeSize.width + 1).keys()].forEach(index => {
      const x = this.blockOffsetX(settings, index) - settings.wallThickness;
      ctx.fillRect(x, 0, settings.wallThickness, ctx.canvas.height);
    });
    [...Array(settings.mazeSize.height + 1).keys()].forEach(index => {
      const y = this.blockOffsetY(settings, index) - settings.wallThickness;
      ctx.fillRect(0, y, ctx.canvas.width, settings.wallThickness);
    });
  }

  private drawWays(maze: Maze, settings: Settings, ctx: Ctx): void {
    maze.space.forEach((column, x) => {
      column.forEach((_, y) => {
        const positionData = this.positionData(maze, { x, y });
        this.drawSpot(settings, positionData, ctx);
        maze.space[x][y].forEach(direction => {
          switch (direction) {
            case Direction.right:
              this.removeWallSegmentRight(settings, { x, y }, ctx);
              this.drawPathSegmentRight(settings, positionData, ctx);
              break;
            case Direction.down:
              this.removeWallSegmentDown(settings, { x, y }, ctx);
              this.drawPathSegmentDown(settings, positionData, ctx);
              break;
            default:
              break;
          }
        });
      });
    });
  }

  private removeWallSegmentRight(settings: Settings, position: Position, ctx: Ctx): void {
    ctx.fillStyle = BG_COLOR;
    ctx.fillRect(
      this.blockOffsetX(settings, position.x + 1) - settings.wallThickness,
      this.blockOffsetY(settings, position.y),
      settings.wallThickness,
      settings.blockSize.height
    );
  }

  private removeWallSegmentDown(settings: Settings, position: Position, ctx: Ctx): void {
    ctx.fillStyle = BG_COLOR;
    ctx.fillRect(
      this.blockOffsetX(settings, position.x),
      this.blockOffsetY(settings, position.y + 1) - settings.wallThickness,
      settings.blockSize.width,
      settings.wallThickness
    );
  }

  private drawSpot(settings: Settings, position: PositionData, ctx: Ctx): void {
    if (!settings.showPaths && !(settings.showShortestPath && position.isOnShortestPath)) return;
    ctx.fillStyle =
      position.isOnShortestPath && settings.showShortestPath ? SHORTEST_PATH_COLOR : PATH_COLOR;
    ctx.fillRect(
      this.blockCenterX(settings, position.x) - settings.pathThickness / 2,
      this.blockCenterY(settings, position.y) - settings.pathThickness / 2,
      settings.pathThickness,
      settings.pathThickness
    );
  }

  private drawPathSegmentRight(settings: Settings, position: PositionData, ctx: Ctx): void {
    const isSegmentOnShortestPath = position.isSegmentOnShortestPath[Direction.right];
    if (!settings.showPaths && !(settings.showShortestPath && isSegmentOnShortestPath)) return;
    ctx.fillStyle =
      settings.showShortestPath && isSegmentOnShortestPath ? SHORTEST_PATH_COLOR : PATH_COLOR;
    ctx.fillRect(
      this.blockCenterX(settings, position.x) + settings.pathThickness / 2,
      this.blockCenterY(settings, position.y) - settings.pathThickness / 2,
      settings.blockSize.width + settings.wallThickness - settings.pathThickness,
      settings.pathThickness
    );
  }

  private drawPathSegmentDown(settings: Settings, position: PositionData, ctx: Ctx): void {
    const isSegmentOnShortestPath = position.isSegmentOnShortestPath[Direction.down];
    if (!settings.showPaths && !(settings.showShortestPath && isSegmentOnShortestPath)) return;
    ctx.fillStyle =
      settings.showShortestPath && isSegmentOnShortestPath ? SHORTEST_PATH_COLOR : PATH_COLOR;
    ctx.fillRect(
      this.blockCenterX(settings, position.x) - settings.pathThickness / 2,
      this.blockCenterY(settings, position.y) + settings.pathThickness / 2,
      settings.pathThickness,
      settings.blockSize.height + settings.wallThickness - settings.pathThickness
    );
  }

  private drawEntrance(settings: Settings, ctx: Ctx): void {
    this.removeWallSegmentRight(settings, { x: -1, y: 0 }, ctx);
    if (!settings.showPaths && !settings.showShortestPath) return;
    ctx.fillStyle = settings.showShortestPath ? SHORTEST_PATH_COLOR : PATH_COLOR;
    ctx.fillRect(
      0,
      this.blockCenterY(settings, 0) - settings.pathThickness / 2,
      settings.blockSize.width / 2 + settings.wallThickness - settings.pathThickness / 2,
      settings.pathThickness
    );
  }

  private drawExit(maze: Maze, settings: Settings, ctx: Ctx): void {
    const lastBlockPosition = this.mazeService.lastBlockPosition(maze);
    this.removeWallSegmentRight(settings, lastBlockPosition, ctx);
    if (!settings.showPaths && !settings.showShortestPath) return;
    ctx.fillStyle = settings.showShortestPath ? SHORTEST_PATH_COLOR : PATH_COLOR;
    ctx.fillRect(
      this.blockOffsetX(settings, lastBlockPosition.x) +
        settings.blockSize.width / 2 +
        settings.pathThickness / 2,
      this.blockOffsetY(settings, lastBlockPosition.y) +
        settings.blockSize.height / 2 -
        settings.pathThickness / 2,
      settings.blockSize.width + settings.wallThickness,
      settings.pathThickness
    );
  }

  private positionData(maze: Maze, position: Position): PositionData {
    const isOnShortestPath = this.mazeService.isOnShortestPath(maze, position);
    const isSegmentOnShortestPath = (direction: Direction) => {
      const segmentEnd = this.geometry.move(position, direction);
      return isOnShortestPath && this.mazeService.isOnShortestPath(maze, segmentEnd);
    };
    return {
      ...position,
      isOnShortestPath,
      isSegmentOnShortestPath: {
        [Direction.right]: isSegmentOnShortestPath(Direction.right),
        [Direction.down]: isSegmentOnShortestPath(Direction.down)
      }
    };
  }

  private blockCenterX(settings: Settings, x: number): number {
    return this.blockOffsetX(settings, x) + settings.blockSize.width / 2;
  }

  private blockCenterY(settings: Settings, y: number): number {
    return this.blockOffsetY(settings, y) + settings.blockSize.height / 2;
  }

  private blockOffsetX(settings: Settings, x: number): number {
    return settings.blockSize.width * x + settings.wallThickness * (x + 1);
  }

  private blockOffsetY(settings: Settings, y: number): number {
    return settings.blockSize.height * y + settings.wallThickness * (y + 1);
  }

}
