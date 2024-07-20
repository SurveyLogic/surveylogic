import {fabric} from 'fabric';
import {IImageOptions, Image, StaticCanvas} from 'fabric/fabric-impl';
import {ActiveFrame, ActiveFrameParts} from './active-frame';
import {Frame} from './frame';
import {staticObjectConfig} from '../../objects/static-object-config';
import {fabricCanvas, state, tools} from '../../state/utils';
import {assetUrl} from '../../utils/asset-url';

interface FramePatternPart {
  name: keyof ActiveFrameParts;
  img: Image;
  canvas: StaticCanvas;
}

export class FramePatterns {
  patternCache: FramePatternPart[] = [];

  constructor(private activeFrame: ActiveFrame) {}

  /**
   * Fill frame part objects with matching pattern images.
   */
  private fillParts(mode: 'stretch' | 'repeat' | 'basic') {
    this.patternCache.forEach(part => {
      this.fillPartWithPattern(part, mode);
    });
  }

  /**
   * Fill specified frame part with matching pattern.
   */
  private fillPartWithPattern(
    part: FramePatternPart,
    mode: 'stretch' | 'repeat' | 'basic'
  ) {
    if (!this.activeFrame.parts) return;
    part.canvas = new fabric.StaticCanvas(null);
    part.canvas.add(part.img);

    const pattern = new fabric.Pattern({
      source: part.canvas.getElement() as any,
      repeat: mode === 'repeat' ? 'repeat' : 'no-repeat',
    });

    if (this.activeFrame.parts[part.name]) {
      this.activeFrame.parts[part.name].set('fill', pattern);
    }
  }

  /**
   * Scale all frame patterns to fill their container rect objects.
   */
  public scale(value: number) {
    if (!this.activeFrame.config || !this.patternCache) {
      return;
    }

    const mode = this.activeFrame.config.mode;

    // @ts-ignore
    value /= fabricCanvas().getRetinaScaling();

    this.patternCache.forEach(part => {
      if (!this.activeFrame.parts) return;
      // scale or repeat top and bottom sides
      if (part.name === 'top' || part.name === 'bottom') {
        if (mode === 'stretch') {
          this.scalePatternToWidth(
            part.img,
            this.activeFrame.parts.top.getScaledWidth()
          ); // minus width of left and right corners
          this.scalePatternToHeight(part.img, value);
        } else {
          part.img.scaleToHeight(value);
        }

        // scale or repeat left and right sides
      } else if (part.name === 'left' || part.name === 'right') {
        if (mode === 'stretch') {
          this.scalePatternToWidth(part.img, value);
          this.scalePatternToHeight(
            part.img,
            this.activeFrame.parts.left.getScaledHeight()
          ); // minus width of left and right corners
        } else {
          part.img.scaleToWidth(value);
        }

        // scale corners
      } else if (mode === 'stretch') {
        this.scalePatternToWidth(part.img, value);
        this.scalePatternToHeight(part.img, value); // minus width of left and right corners
      } else {
        part.img.scaleToWidth(value);
      }
      part.canvas.setDimensions({
        width: part.img.getScaledWidth(),
        height: part.img.getScaledHeight(),
      });
    });
    tools().canvas.render();
  }

  /**
   * Scale pattern image to specified width.
   */
  private scalePatternToWidth(pattern: Image, value: number) {
    if (!pattern.width) return;
    const boundingRectFactor =
      pattern.getBoundingRect().width / pattern.getScaledWidth();
    pattern.set('scaleX', value / pattern.width / boundingRectFactor);
    pattern.setCoords();
  }

  /**
   * Scale pattern image to specified height.
   */
  private scalePatternToHeight(pattern: Image, value: number) {
    if (!pattern.height) return;
    const boundingRectFactor =
      pattern.getBoundingRect().height / pattern.getScaledHeight();
    pattern.set('scaleY', value / pattern.height / boundingRectFactor);
    pattern.setCoords();
  }

  /**
   * Load all images needed to build specified frame.
   */
  public load(frame: Frame) {
    const promises = this.activeFrame.getPartNames().map(part => {
      return new Promise(resolve => {
        const config = {
          ...staticObjectConfig,
          originX: 'left',
          originY: 'top',
        } as IImageOptions;
        if (state().config.crossOrigin) {
          config.crossOrigin = 'anonymous';
        }
        fabric.Image.fromURL(
          this.getPartUrl(frame, part),
          img => {
            resolve({name: part, img});
          },
          config
        );
      });
    });

    return Promise.all(promises).then(images => {
      this.patternCache = images as any;
      this.fillParts(frame.mode);
    });
  }

  private getPartUrl(frame: Frame, part: string): string {
    return assetUrl(`images/frames/${frame.name}/${part}.png`);
  }
}
