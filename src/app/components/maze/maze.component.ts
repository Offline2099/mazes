import {
  Component, ElementRef, viewChild, inject, signal, input, computed, effect, untracked
} from '@angular/core';
import { Maze } from '../../types/maze.interface';
import { Settings } from '../../types/settings.interface';
import { DownloadService } from '../../services/download.service';
import { DrawingService } from '../../services/drawing.service';

@Component({
  selector: 'app-maze',
  imports: [],
  templateUrl: './maze.component.html',
  styleUrl: './maze.component.scss'
})
export class MazeComponent {

  private drawingService = inject(DrawingService);
  private download = inject(DownloadService);

  maze = input.required<Maze>();
  settings = input.required<Settings>();
  isGenerated = input.required<boolean>();

  canvasRef1 = viewChild.required<ElementRef<HTMLCanvasElement>>('canvas1');
  canvasRef2 = viewChild.required<ElementRef<HTMLCanvasElement>>('canvas2');

  activeCanvasId = signal(1);
  activeCanvasRef = computed(() => this.getActiveCanvas(this.activeCanvasId()));

  width = computed(() => this.currentWidthPx(this.settings()));
  height = computed(() => this.currentHeightPx(this.settings()));

  frameId: number | null = 0;

  constructor() {
    effect(() => this.drawMaze(this.maze(), this.settings(), this.isGenerated()));
  }

  getActiveCanvas(id: number): ElementRef<HTMLCanvasElement> {
    return id === 1 ? this.canvasRef1() : this.canvasRef2();
  }

  switchCanvas(): void {
    this.activeCanvasId.update(value => (value === 1 ? 2 : 1));
  }

  currentWidthPx(settings: Settings): number {
    const blockCount = settings.mazeSize.width;
    return settings.blockSize.width * blockCount + settings.wallThickness * (blockCount + 1);
  }

  currentHeightPx(settings: Settings): number {
    const blockCount = settings.mazeSize.height;
    return settings.blockSize.height * blockCount + settings.wallThickness * (blockCount + 1);
  }

  drawMaze(maze: Maze, settings: Settings, isGenerated: boolean): void {
    if (this.frameId !== null) cancelAnimationFrame(this.frameId);
    this.switchCanvas();
    this.frameId = requestAnimationFrame(() => {
      const canvas = untracked(() => this.activeCanvasRef().nativeElement);
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      this.drawingService.drawMaze(maze, settings, isGenerated, ctx);
    });
  }

  saveMaze(): void {
    this.download.downloadCanvasAsPNG(
      this.activeCanvasRef().nativeElement,
      `maze-${this.timestamp()}`
    );
  }

  timestamp(): string {
    const pad = (n: number, padding: number = 2) => {
      return String(n).padStart(padding, '0');
    };
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = pad(d.getMonth() + 1);
    const dd = pad(d.getDate());
    const hh = pad(d.getHours());
    const min = pad(d.getMinutes());
    const ss = pad(d.getSeconds());
    const ms = pad(d.getMilliseconds(), 3);
    return `${yyyy}-${mm}-${dd}-${hh}-${min}-${ss}-${ms}`;
  }

}
