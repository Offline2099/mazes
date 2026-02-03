import { Injectable } from '@angular/core';
import { Direction } from '../constants/direction.enum';
import { Position } from '../types/position.interface';
import { Range } from '../types/range.interface';
import { Size } from '../types/size.interface';
import { Maze } from '../types/maze.type';
import { UtilityService } from './utility.service';

@Injectable({
  providedIn: 'root'
})
export class MazeService {

  constructor(private utility: UtilityService) { }

  //===========================================================================
  //  Maze Generation
  //===========================================================================

  createMazeSpace(size: Size): Maze {
    return Array.from(
      { length: size.width },
      () => Array.from({ length: size.height }, () => [])
    );
  }

  generateMaze(space: Maze, start: Position): Maze {
    const path: Position[] = [start];
    let position: Position = { ...start };
    let direction: Direction | null = this.randomDirection(space, position);
    if (direction) space[position.x][position.y].push(direction);
    while (direction !== null) {
      position = this.utility.move(position, direction);
      space[position.x][position.y].push(this.utility.oppositeDirection(direction));
      direction = this.randomDirection(space, position);
      if (direction) space[position.x][position.y].push(direction);
      path.push({ ...position });
      while (direction === null && path.length > 1) {
        path.pop();
        position = { ...path[path.length - 1] };
        direction = this.randomDirection(space, position);
        if (direction) space[position.x][position.y].push(direction);
      }
    }
    return space;
  }

  //===========================================================================
  //  Maze Utility
  //===========================================================================

  width(maze: Maze): number {
    return maze.length;
  }

  height(maze: Maze): number {
    return maze[0].length;
  }

  size(maze: Maze): Size {
    return {
      width: this.width(maze),
      height: this.height(maze)
    };
  }

  private isVisited(maze: Maze, position: Position): boolean {
    return maze[position.x][position.y].length > 0;
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