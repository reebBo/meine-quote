declare module 'html2canvas' {
  export interface Html2CanvasOptions {
    backgroundColor?: string | null;
    scale?: number;
  }

  export default function html2canvas(
    element: HTMLElement,
    options?: Html2CanvasOptions
  ): Promise<HTMLCanvasElement>;
}

declare module 'html2canvas/dist/html2canvas.esm.js' {
  export interface Html2CanvasOptions {
    backgroundColor?: string | null;
    scale?: number;
  }

  export default function html2canvas(
    element: HTMLElement,
    options?: Html2CanvasOptions
  ): Promise<HTMLCanvasElement>;
}
