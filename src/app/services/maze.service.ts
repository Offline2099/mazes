import { Injectable } from '@angular/core';
import { Maze } from '../types/maze.type';
import { Position } from '../types/position.interface';
import { Direction } from '../constants/direction.enum';
import { Size } from '../types/size.interface';

@Injectable({
  providedIn: 'root'
})
export class MazeService {

  generateMaze(space: Maze, start: Position): Maze {
    const path: Position[] = [start];
    let position: Position = { ...start };
    let direction: Direction | null = this.randomDirection(space, position);
    if (direction) space[position.x][position.y].push(direction);
    while (direction !== null) {
      position = this.move(position, direction);
      space[position.x][position.y].push(this.oppositeDirection(direction));
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

  createMazeSpace(size: Size): Maze {
    return Array.from(
      { length: size.width },
      () => Array.from({ length: size.height }, () => [])
    );
  }

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

  move(position: Position, direction: Direction): Position {
    switch (direction) {
      case Direction.up:
        return { x: position.x, y: position.y - 1 };
      case Direction.down:
        return { x: position.x, y: position.y + 1 };
      case Direction.left:
        return { x: position.x - 1, y: position.y };
      case Direction.right:
        return { x: position.x + 1, y: position.y };
    }
  }

  private randomDirection(maze: Maze, position: Position): Direction | null {
    const directions: Direction[] = this.availableDirections(maze, position);
    if (directions.length === 0) return null;    
    return this.randomFromArray(directions);
  }

  private availableDirections(maze: Maze, position: Position): Direction[] {
    const directions: Direction[] = [];
    if (position.x > 0) {
      if (maze[position.x - 1][position.y].length === 0) directions.push(Direction.left);
    }
    if (position.x < maze.length - 1) {
      if (maze[position.x + 1][position.y].length === 0) directions.push(Direction.right);
    }
    if (position.y > 0) {
      if (maze[position.x][position.y - 1].length === 0) directions.push(Direction.up);
    } 
    if (position.y < maze[0].length - 1) {
      if (maze[position.x][position.y + 1].length === 0) directions.push(Direction.down);
    } 
    return directions;
  }

  private oppositeDirection(direction: Direction): Direction {
    switch (direction) {
      case Direction.up:
        return Direction.down;
      case Direction.down:
        return Direction.up;
      case Direction.left:
        return Direction.right;
      case Direction.right:
        return Direction.left;
    }
  }

  private randomInteger(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  private randomFromArray<T>(array: T[]): T {
    return array[this.randomInteger(0, array.length - 1)];
  }

}