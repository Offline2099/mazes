import { Service, inject } from '@angular/core';
import { Direction } from '../constants/direction.enum';
import { DEFAULT_SETTINGS } from '../constants/default-settings';
import { Position } from '../types/general/position.interface';
import { Range2D } from '../types/general/range2d.interface';
import { Size } from '../types/general/size.interface';
import { Maze } from '../types/maze.interface';
import { RNGService } from './rng.service';
import { GeometryService } from './geometry.service';

@Service()
export class MazeService {

  private rng = inject(RNGService);
  private geometry = inject(GeometryService);

  createMazeObject(size: Size = DEFAULT_SETTINGS.mazeSize): Maze {
    return {
      space: Array.from(
        { length: size.width },
        () => Array.from({ length: size.height }, () => [])
      ),
      shortestPath: []
    };
  }

  generateMaze(maze: Maze): Maze {
    const entrance = { x: 0, y: 0 } as Position;
    const exit = this.lastBlockPosition(maze);
    const path = [entrance];
    let position = entrance;
    let direction = this.randomDirection(maze, position);
    if (direction) maze.space[position.x][position.y].push(direction);
    while (direction !== null) {
      position = this.geometry.move(position, direction);
      maze.space[position.x][position.y].push(this.geometry.oppositeDirection(direction));
      direction = this.randomDirection(maze, position);
      if (direction) maze.space[position.x][position.y].push(direction);
      path.push({ ...position });
      if (this.geometry.isSamePosition(position, exit)) maze.shortestPath = [...path];
      while (direction === null && path.length > 1) {
        path.pop();
        position = { ...path[path.length - 1] };
        direction = this.randomDirection(maze, position);
        if (direction) maze.space[position.x][position.y].push(direction);
      }
    }
    return maze;
  }

  currentWidth(maze: Maze): number {
    return maze.space.length;
  }

  currentHeight(maze: Maze): number {
    if (!maze.space.length) return 0;
    return maze.space[0].length;
  }

  lastBlockPosition(maze: Maze): Position {
    return {
      x: this.currentWidth(maze) - 1,
      y: this.currentHeight(maze) - 1
    };
  }

  isOnShortestPath(maze: Maze, position: Position): boolean {
    return maze.shortestPath
      .find(value => this.geometry.isSamePosition(position, value)) !== undefined;
  }

  private randomDirection(maze: Maze, position: Position): Direction | null {
    const directions = this.availableDirections(maze, position);
    return directions.length ? this.rng.randomFromArray(directions) : null;
  }

  private availableDirections(maze: Maze, position: Position): Direction[] {
    return Object.values(Direction).filter(direction => {
      if (typeof direction !== 'number') return false;
      const newPosition = this.geometry.move(position, direction);
      return (
        !this.geometry.isOutsideArea(this.mazeToRange2D(maze), newPosition) &&
        !this.isVisited(maze, newPosition)
      );
    }) as Direction[];
  }

  private mazeToRange2D(maze: Maze): Range2D {
    return {
      x: { min: 0, max: this.currentWidth(maze) - 1 },
      y: { min: 0, max: this.currentHeight(maze) - 1 }
    };
  }

  private isVisited(maze: Maze, position: Position): boolean {
    return maze.space[position.x][position.y].length > 0;
  }

}
