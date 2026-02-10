import { Range } from '../general/range.interface';

export interface Slider {
  name: string;
  range: Range;
  step: number;
  value: number;
}