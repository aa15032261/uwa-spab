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
}
