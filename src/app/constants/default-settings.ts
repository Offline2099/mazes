import { Settings } from '../types/settings.interface';

export const DEFAULT_SETTINGS: Settings = {
  mazeSize: {
    width: 10,
    height: 8
  },
  keepMazeSquare: false,
  blockSize: {
    width: 30,
    height: 30
  },
  keepBlocksSquare: true,
  wallThickness: 2,
  pathThickness: 2,
  showPaths: false,
  showShortestPath: false
};
