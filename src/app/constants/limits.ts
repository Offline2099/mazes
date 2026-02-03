import { Limits } from '../types/limits.interface';

export const LIMITS: Limits = {
  mazeWidth: {
    min: 2,
    max: 50
  },
  mazeHeight: {
    min: 2,
    max: 50
  },
  blockWidth: {
    min: 10,
    max: 50
  },
  blockHeight: {
    min: 10,
    max: 50
  },
  wallThickness: {
    min: 1,
    max: 10
  },
  pathThickness: {
    min: 2,
    max: 8
  }
}