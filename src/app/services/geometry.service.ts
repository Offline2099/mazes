import { Service } from '@angular/core';
import { Direction } from '../constants/direction.enum';
import { Position } from '../types/general/position.interface';
import { Range } from '../types/general/range.interface';
import { Range2D } from '../types/general/range2d.interface';

type Shift = 0 | 1 | -1;

const OPPOSITE_DIRECTION_MAP: Record<Direction, Direction> = {
  [Direction.up]: Direction.down,
  [Direction.down]: Direction.up,
  [Direction.left]: Direction.right,
  [Direction.right]: Direction.left
};

const SHIFT_MAP: Record<Direction, { x: Shift; y: Shift }> = {
  [Direction.up]: { x: 0, y: -1 },
  [Direction.down]: { x: 0, y: 1 },
  [Direction.left]: { x: -1, y: 0 },
  [Direction.right]: { x: 1, y: 0 }
};

@Service()
export class GeometryService {

  isSamePosition(a: Position, b: Position): boolean {
    return a.x === b.x && a.y === b.y;
  }

  oppositeDirection(direction: Direction): Direction {
    return OPPOSITE_DIRECTION_MAP[direction];
  }

  move(position: Position, direction: Direction): Position {
    return {
      x: position.x + SHIFT_MAP[direction].x,
      y: position.y + SHIFT_MAP[direction].y
    };
  }

  isOutsideRange(range: Range, value: number): boolean {
    return value < range.min || value > range.max;
  }

  isOutsideArea(range: Range2D, position: Position): boolean {
    return this.isOutsideRange(range.x, position.x) || this.isOutsideRange(range.y, position.y);
  }

}
