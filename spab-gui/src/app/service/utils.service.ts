import { Injectable } from '@angular/core';

import ElementResizeDetectorInit, { ElementResizeDetector } from 'element-resize-detector';



@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  private _resizeDetector: ElementResizeDetector;

  constructor() {
    // initialise resize detector
    this._resizeDetector = ElementResizeDetectorInit({ strategy: 'scroll' });
  }

  // add a resize listener to element
  public addResizeListener(element: HTMLElement, handler: (elem: HTMLElement) => void) {
    this._resizeDetector.listenTo(element, handler);
  }
  // remove the resize listener from element
  public removeResizeListener(element: HTMLElement) {
    this._resizeDetector.uninstall(element);
  }

  public imgToCanvas(canvas: HTMLCanvasElement, img: HTMLImageElement) {
    // Get the device pixel ratio, falling back to 1.
    let dpr = window.devicePixelRatio || 1;
    // Get the size of the canvas in CSS pixels.
    let rect = canvas.getBoundingClientRect();
    // Give the canvas pixel dimensions of their CSS
    // size * the device pixel ratio.
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;

    let ctx = canvas.getContext('2d');

    if (ctx) {
      // Scale all drawing operations by the dpr, so you
      // don't have to worry about the difference.
      ctx.scale(dpr, dpr);

      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, rect.width, rect.height);

      let imgRatio = img.width / img.height;
      let canvasRatio = rect.width / rect.height;

      let dx = 0;
      let dy = 0;
      let width = rect.width;
      let height = rect.height;

      if (imgRatio > canvasRatio) {
        let scale = rect.width / img.width;
        let adjustedHeight = img.height * scale;

        dy = (rect.height - adjustedHeight) / 2;
        height = adjustedHeight;
      } else if (imgRatio < canvasRatio) {
        let scale = rect.height / img.height;
        let adjustedWidth = img.width * scale;

        dx = (rect.width - adjustedWidth) / 2;
        width = adjustedWidth;
      }

      ctx.drawImage(img, dx, dy, width, height);
    }
  }
}
