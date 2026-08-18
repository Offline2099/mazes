import { Slider } from '../types/ui/slider.interface';

export const MAZE_WIDTH_SLIDER: Slider = {
  name: 'Maze Width',
  range: { min: 2, max: 50 },
  step: 1
};

export const MAZE_HEIGHT_SLIDER: Slider = {
  name: 'Maze Height',
  range: { min: 2, max: 50 },
  step: 1
};

export const KEEP_MAZE_SQUARE = 'Square Maze';

export const BLOCK_WIDTH_SLIDER: Slider = {
  name: 'Block Width',
  range: { min: 10, max: 50 },
  step: 2
};

export const BLOCK_HEIGHT_SLIDER: Slider = {
  name: 'Block Height',
  range: { min: 10, max: 50 },
  step: 2
};

export const KEEP_BLOCKS_SQUARE = 'Square Blocks';

export const WALL_THICKNESS_SLIDER: Slider = {
  name: 'Wall Thicknness',
  range: { min: 1, max: 10 },
  step: 1
};

export const PATH_THICKNESS_SLIDER: Slider = {
  name: 'Path Thicknness',
  range: { min: 2, max: 8 },
  step: 2
};

export const SHOW_PATHS = 'Show Paths';
export const SHOW_SHORTEST_PATH = 'Show Shortest Path';
