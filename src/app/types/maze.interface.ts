import { Direction } from '../constants/direction.enum';
import { Position } from './general/position.interface';

export interface Maze {
  space: Direction[][][];
  shortestPath: Position[];
}
