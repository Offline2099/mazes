import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { Direction } from '../constants/direction.enum';
import { Position } from '../types/general/position.interface';
import { Range } from '../types/general/range.interface';

@Injectable({
  providedIn: 'root'
})
export class UtilityService {

  private renderer: Renderer2;

  constructor(rendererFactory: RendererFactory2) {
    this.renderer = rendererFactory.createRenderer(null, null);
  }

  //===========================================================================
  //  Randomness
  //===========================================================================

  randomInteger(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  randomFromArray<T>(array: T[]): T {
    return array[this.randomInteger(0, array.length - 1)];
  }

  //===========================================================================
  //  Geometry
  //===========================================================================

  isSamePosition(a: Position, b: Position): boolean {
    return a.x === b.x && a.y === b.y;
  }

  private readonly OPPOSITE_DIRECTION_MAP: Record<Direction, Direction> = {
    [Direction.up]: Direction.down,
    [Direction.down]: Direction.up,
    [Direction.left]: Direction.right,
    [Direction.right]: Direction.left
  };

  oppositeDirection(direction: Direction): Direction {
    return this.OPPOSITE_DIRECTION_MAP[direction];
  }

  private readonly SHIFT_MAP: Record<Direction, { x: 0 | 1 | -1, y: 0 | 1 | -1 }> = {
    [Direction.up]: { x: 0, y: -1 },
    [Direction.down]: { x: 0, y: 1 },
    [Direction.left]: { x: -1, y: 0 },
    [Direction.right]: { x: 1, y: 0 }
  }

  move(position: Position, direction: Direction): Position {
    return {
      x: position.x + this.SHIFT_MAP[direction].x,
      y: position.y + this.SHIFT_MAP[direction].y
    };
  }

  isOutsideRange(range: Range, value: number): boolean {
    return value < range.min || value > range.max;
  }

  isOutsideArea(rangeX: Range, rangeY: Range, position: Position): boolean {
    return this.isOutsideRange(rangeX, position.x) || this.isOutsideRange(rangeY, position.y);
  }

  //===========================================================================
  //  Saving Files
  //===========================================================================

  downloadAsPNG(canvas: HTMLCanvasElement, container: HTMLElement, fileName: string): void {
    const url: string = canvas.toDataURL('image/png');
    this.saveFile(url, fileName, 'png', container);
  }

  private saveFile(url: string, name: string, extension: string, container: HTMLElement): void {
    const a: HTMLAnchorElement = this.renderer.createElement('a');
    this.renderer.setAttribute(a, 'href', url);
    this.renderer.setAttribute(a, 'download', `${name}.${extension}`);
    this.renderer.appendChild(container, a);
    a.click();
    this.renderer.removeChild(container, a);
    window.URL.revokeObjectURL(url);
  }

}