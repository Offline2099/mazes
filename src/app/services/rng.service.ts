import { Service } from '@angular/core';

@Service()
export class RNGService {

  randomInteger(min: number, max: number): number {
    if (max < min) 
      throw new Error(`Invalid arguments: minimum (${min}) exceeds maximum (${max}).`);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  randomFromArray<T>(array: T[]): T {
    return array[this.randomInteger(0, array.length - 1)];
  }

}
