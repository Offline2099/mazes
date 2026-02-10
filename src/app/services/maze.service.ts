import { Injectable } from '@angular/core';
import { Direction } from '../constants/direction.enum';
import { Position } from '../types/general/position.interface';
import { Range } from '../types/general/range.interface';
import { Size } from '../types/general/size.interface';
import { Maze } from '../types/maze.interface';
import { UtilityService } from './utility.service';

@Injectable({
  providedIn: 'root'
})
export class MazeService {

  constructor(private utility: UtilityService) { }

  //===========================================================================
  //  Maze Generation
  //===========================================================================

  createMazeObject(size: Size): Maze {
    return {
      space: Array.from(
        { length: size.width },
        () => Array.from({ length: size.height }, () => [])
      ),
      shortestPath: []
    };
  }

  generateMaze(maze: Maze): Maze {
    const entrance: Position = { x: 0, y: 0 };
    const exit: Position = this.lastBlockPosition(maze);
    const path: Position[] = [entrance];
    let position: Position = { ...entrance };
    let direction: Direction | null = this.randomDirection(maze, position);
    if (direction) maze.space[position.x][position.y].push(direction);
    while (direction !== null) {
      position = this.utility.move(position, direction);
      maze.space[position.x][position.y].push(this.utility.oppositeDirection(direction));
      direction = this.randomDirection(maze, position);
      if (direction) maze.space[position.x][position.y].push(direction);
      path.push({ ...position });
      if (this.utility.isSamePosition(position, exit)) maze.shortestPath = [...path];
      while (direction === null && path.length > 1) {
        path.pop();
        position = { ...path[path.length - 1] };
        direction = this.randomDirection(maze, position);
        if (direction) maze.space[position.x][position.y].push(direction);
      }
    }
    return maze;
  }

  //===========================================================================
  //  Maze Utility
  //===========================================================================

  width(maze: Maze): number {
    return maze.space.length;
  }

  height(maze: Maze): number {
    return maze.space[0].length;
  }

  size(maze: Maze): Size {
    return {
      width: this.width(maze),
      height: this.height(maze)
    };
  }

  lastBlockPosition(maze: Maze) : Position {
    return {
      x: this.width(maze) - 1,
      y: this.height(maze) - 1
    };
  }

  isOnShortestPath(maze: Maze, position: Position): boolean {
    return maze.shortestPath.find(value => this.utility.isSamePosition(position, value)) !== undefined;
  }

  private isVisited(maze: Maze, position: Position): boolean {
    return maze.space[position.x][position.y].length > 0;
  }

  private availableDirections(maze: Maze, position: Position): Direction[] {
    const rangeX: Range = { min: 0, max: this.width(maze) - 1 };
    const rangeY: Range = { min: 0, max: this.height(maze) - 1 };
    return Object.values(Direction).filter(Number)
      .filter(direction => {
        const shifted: Position = this.utility.move(position, direction as Direction);
        return !this.utility.isOutsideArea(rangeX, rangeY, shifted) && !this.isVisited(maze, shifted);
      }) as Direction[];
  }

  private randomDirection(maze: Maze, position: Position): Direction | null {
    const directions: Direction[] = this.availableDirections(maze, position);
    if (directions.length === 0) return null;    
    return this.utility.randomFromArray(directions);
  }

}