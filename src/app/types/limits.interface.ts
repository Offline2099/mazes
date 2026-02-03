import { Range } from './range.interface';

export interface Limits {
  mazeWidth: Range;
  mazeHeight: Range;
  blockWidth: Range;
  blockHeight: Range;
  wallThickness: Range;
}