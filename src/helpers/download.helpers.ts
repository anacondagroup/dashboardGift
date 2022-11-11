import { Canvg, presets } from 'canvg';
import saveAs from 'file-saver';

export const convertSvgFromHtmlElementToBlob = async ({ htmlSvgId }: { htmlSvgId: string }): Promise<Blob | null> => {
  const svgElement = document.getElementById(htmlSvgId);
  if (!svgElement) {
    return null;
  }
  const canvas = new OffscreenCanvas(
    svgElement.getBoundingClientRect().width,
    svgElement.getBoundingClientRect().height,
  );
  const ctx = canvas?.getContext('2d');
  if (!ctx) {
    return null;
  }
  const preset = presets.offscreen();
  const render = await Canvg.fromString(ctx, svgElement.outerHTML, preset);
  await render.render();

  const blob = await canvas.convertToBlob();
  return blob;
};

export const downloadBlobAsPng = ({ blob, filename }: { blob: Blob; filename: string }): void =>
  saveAs(blob, `${filename || 'New Image'}.png`);
