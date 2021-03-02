declare module 'element-resize-detector' {
    
    export interface ElementResizeDetectorOptions {
        strategy?: 'scroll' | 'object';
    }

    export interface ElementResizeDetector {
        listenTo(element: HTMLElement, callback: (elem: HTMLElement) => void) : void;
        removeListener(element: HTMLElement, callback: (elem: HTMLElement) => void) : void;
        removeAllListeners(element: HTMLElement) : void;
        uninstall(element: HTMLElement) : void;
    }

    export default function ElementResizeDetectorInit(option: ElementResizeDetectorOptions): ElementResizeDetector;
}
