import { Range } from './range.interface';

export interface Slider {
  name: string;
  range: Range;
  step: number;
  value: number;
}