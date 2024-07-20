import {IRectOptions, Object as IObject} from 'fabric/fabric-impl';
import {fabric} from 'fabric';
import {fabricCanvas, state, tools} from '../../state/utils';
import {StraightenAnchor} from './straighten-anchor';
import {staticObjectConfig} from '../../objects/static-object-config';
import {ObjectName} from '../../objects/object-name';

export class TransformTool {
  private get straightenAnchor(): StraightenAnchor {
    return fabricCanvas()
      .getObjects()
      .find(
        obj => obj.name === ObjectName.StraightenAnchor
      ) as StraightenAnchor;
  }

  /**
   * Rotate canvas left by 90 degrees.
   */
  rotateLeft() {
    this.rotateFixed(-90);
  }

  /**
   * Rotate canvas right by 90 degrees.
   */
  rotateRight() {
    this.rotateFixed(90);
  }

  /**
   * Straighten canvas by specified number of degrees.
   */
  straighten(degrees: number) {
    this.storeObjectsRelationToHelper();
    tools().objects.deselectActive();
    const newAngle = (this.straightenAnchor.data.rotateAngle || 0) + degrees;
    const scale = this.getImageScale(newAngle, this.straightenAnchor);

    this.straightenAnchor.angle = newAngle;
    this.straightenAnchor.scaleX = scale;
    this.straightenAnchor.scaleY = scale;

    this.straightenAnchor.data.straightenAngle = degrees;

    this.transformObjectsBasedOnHelper();
  }

  /**
   * Flip canvas vertically or horizontally.
   */
  flip(direction: 'horizontal' | 'vertical') {
    const prop = direction === 'horizontal' ? 'flipY' : 'flipX';
    tools()
      .objects.getAll()
      .forEach(obj => {
        obj[prop] = !obj[prop];
      });
    tools().canvas.render();
  }

  private rotateFixed(degrees: number) {
    tools().zoom.set(1, false);
    tools().objects.deselectActive();
    const currentRotateAngle = this.straightenAnchor.data.rotateAngle || 0;
    degrees = Math.round(degrees / 90) * 90;
    const newAngle =
      currentRotateAngle +
      (this.straightenAnchor.data.straightenAngle || 0) +
      degrees;

    // noinspection JSSuspiciousNameCombination
    tools().canvas.resize(state().original.height, state().original.width, {
      applyZoom: false,
      resizeHelper: false,
    });

    this.storeObjectsRelationToHelper();

    this.straightenAnchor.rotate(newAngle);
    this.straightenAnchor.data.rotateAngle = currentRotateAngle + degrees;

    this.straightenAnchor.center();
    this.transformObjectsBasedOnHelper();
    tools().frame.resize(tools().frame.active.currentSizeInPercent);
    // pattern frames dont resize properly if we dont zoom on next paint
    requestAnimationFrame(() => {
      tools().zoom.fitToScreen();
    });
  }

  /**
   * Get minimum scale in order for image to fill the whole canvas, based on rotation.
   */
  private getImageScale(angle: number, image: IObject): number {
    angle = fabric.util.degreesToRadians(angle);
    const w = state().original.width;
    const h = state().original.height;
    const cw = w / 2;
    const ch = h / 2;

    const iw = image.width! / 2;
    const ih = image.height! / 2;
    const dist = Math.sqrt(cw ** 2 + ch ** 2);
    const diagAngle = Math.asin(ch / dist);

    let a1 = ((angle % (Math.PI * 2)) + Math.PI * 4) % (Math.PI * 2);
    if (a1 > Math.PI) {
      a1 -= Math.PI;
    }
    if (a1 > Math.PI / 2 && a1 <= Math.PI) {
      a1 = Math.PI / 2 - (a1 - Math.PI / 2);
    }

    const ang1 = Math.PI / 2 - diagAngle - Math.abs(a1);
    const ang2 = Math.abs(diagAngle - Math.abs(a1));
    const dist1 = Math.cos(ang1) * dist;
    const dist2 = Math.cos(ang2) * dist;
    return Math.max(dist2 / iw, dist1 / ih);
  }

  private storeObjectsRelationToHelper() {
    tools()
      .objects.getAll()
      .forEach(o => {
        if (o !== this.straightenAnchor) {
          const relationToCanvas = fabric.util.multiplyTransformMatrices(
            fabric.util.invertTransform(
              this.straightenAnchor.calcTransformMatrix()
            ),
            o.calcTransformMatrix()
          );
          o.data = {...o.data, relationToCanvas};
        }
      });
  }

  private transformObjectsBasedOnHelper() {
    tools()
      .objects.getAll()
      .forEach(o => {
        if (o.data.relationToCanvas) {
          const newTransform = fabric.util.multiplyTransformMatrices(
            this.straightenAnchor.calcTransformMatrix(),
            o.data.relationToCanvas
          );
          const opt = fabric.util.qrDecompose(newTransform);
          o.set({flipX: false, flipY: false});
          o.setPositionByOrigin(
            {x: opt.translateX, y: opt.translateY} as any,
            'center',
            'center'
          );
          o.set(opt);
          o.setCoords();
          o.data.relationToCanvas = null;
        }
      });
  }

  /**
   * @hidden
   */
  resetStraightenAnchor() {
    const oldHelper = this.straightenAnchor;
    if (oldHelper) {
      fabricCanvas().remove(oldHelper);
    }
    const newHelper = new fabric.Rect({
      ...(staticObjectConfig as IRectOptions),
      name: ObjectName.StraightenAnchor,
      visible: false,
      width: state().original.width,
      height: state().original.height,
      data: {
        pixieInternal: true,
        straightenAngle: 0,
        rotateAngle: 0,
      },
    }) as StraightenAnchor;
    fabricCanvas().add(newHelper);
    newHelper.viewportCenter();
  }
}
