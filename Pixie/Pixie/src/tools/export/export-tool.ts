import {saveAs} from 'file-saver';
import {getCurrentCanvasState} from '../history/state/get-current-canvas-state';
import {fabricCanvas, state, tools} from '../../state/utils';
import {b64toBlob} from './b64-to-blob';
import {toast} from '@common/ui/toast/toast';
import {message} from '@common/i18n/message';

type ValidFormats = 'png' | 'jpeg' | 'json' | 'svg';

export class ExportTool {
  /**
   * Primary "save" function. This is called when user clicks "Done" button in the toolbar.
   * It will apply watermark (if specified) and execute one of the actions below in the order of priority:
   *
   * 1. Send image data to url. If specified via "saveUrl" option in configuration.
   * 2. Execute "onSave" callback function. If provided in configuration.
   * 3. Download image or state file to user device with specified name, format and quality.
   */
  save(name?: string, format?: ValidFormats, quality?: number) {
    const exportConfig = state().config.tools?.export;
    name = name || exportConfig?.defaultName;
    format = this.getFormat(format);
    quality = this.getQuality(quality);

    const filename = `${name}.${format}`;

    this.applyWaterMark();

    const data: string | null =
      format === 'json'
        ? this.getJsonState()
        : this.getDataUrl(format, quality);

    tools().watermark.remove();

    if (!data) return;

    if (state().config.saveUrl) {
      fetch(state().config.saveUrl!, {
        method: 'POST',
        body: JSON.stringify({data, filename, format}),
      });
    } else if (state().config.onSave) {
      state().config.onSave?.(data, filename, format);
    } else {
      const blob = this.getCanvasBlob(format, data);
      saveAs(blob, filename);
    }
  }

  /**
   * Returns base64 encoded data for current image.
   */
  getDataUrl(format?: ValidFormats, quality?: number): string | null {
    this.prepareCanvas();
    try {
      if (format === 'svg') {
        return fabricCanvas().toSVG();
      }
      return fabricCanvas().toDataURL({
        format: this.getFormat(format),
        quality: this.getQuality(quality),
        multiplier: Math.max(
          state().original.width / fabricCanvas().width!,
          state().original.height / fabricCanvas().height!
        ),
      });
    } catch (e) {
      if ((e as TypeError).message.toLowerCase().includes('tainted')) {
        toast.danger(message('Could not export canvas with external image.'));
      }
    }
    return null;
  }

  private getCanvasBlob(format: ValidFormats, data: string): Blob {
    if (format === 'json') {
      return new Blob([data], {type: 'application/json'});
    }
    if (format === 'svg') {
      return new Blob([data], {type: 'image/svg+xml'});
    }
    const contentType = `image/${format}`;
    data = data.replace(/data:image\/([a-z]*)?;base64,/, '');
    return b64toBlob(data, contentType);
  }

  private getJsonState(): string {
    return JSON.stringify({
      ...getCurrentCanvasState(),
      history: state().history,
    });
  }

  private prepareCanvas() {
    fabricCanvas().discardActiveObject();
  }

  private applyWaterMark() {
    const watermark = state().config.watermarkText;
    if (watermark) {
      tools().watermark.add(watermark);
    }
  }

  private getFormat(format?: ValidFormats | 'jpg'): ValidFormats {
    const config = state().config.tools?.export;
    format = format || config?.defaultFormat || 'png';
    if (format === 'jpg') format = 'jpeg';
    return format;
  }

  private getQuality(quality?: number): number {
    const config = state().config.tools?.export;
    quality = quality || config?.defaultQuality || 0.8;
    return quality;
  }
}
