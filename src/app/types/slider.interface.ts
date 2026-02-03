import { Range } from './range.interface';

export interface Slider {
  range: Range;
  step: number;
  value: number;
}