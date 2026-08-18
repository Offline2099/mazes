import { Service, inject, DOCUMENT, RendererFactory2 } from '@angular/core';

@Service()
export class DownloadService {

  private document = inject(DOCUMENT);
  private rendererFactory = inject(RendererFactory2);
  private renderer = this.rendererFactory.createRenderer(null, null);

  downloadCanvasAsPNG(canvas: HTMLCanvasElement, fileName: string): void {
    const url = canvas.toDataURL('image/png');
    this.saveFile(url, fileName, 'png');
  }

  private saveFile(url: string, name: string, extension: string): void {
    const a = this.renderer.createElement('a') as HTMLAnchorElement;
    this.renderer.setAttribute(a, 'href', url);
    this.renderer.setAttribute(a, 'download', `${name}.${extension}`);
    this.renderer.appendChild(this.document.body, a);
    a.click();
    this.renderer.removeChild(this.document.body, a);
    window.URL.revokeObjectURL(url);
  }

}
