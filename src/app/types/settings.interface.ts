import { Size } from './general/size.interface';

export interface Settings {
  mazeSize: Size;
  keepMazeSquare: boolean;
  blockSize: Size;
  keepBlocksSquare: boolean;
  wallThickness: number;
  pathThickness: number;
  showPaths: boolean;
  showShortestPath: boolean;
}
