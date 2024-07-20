import {Object} from 'fabric/fabric-impl';
import {fabric} from 'fabric';
import {BasicShape, PathOptions} from '../../config/default-shapes';
import {StickerCategory} from '../../config/default-stickers';
import {ObjectName} from '../../objects/object-name';
import {fabricCanvas, state, tools} from '../../state/utils';
import {assetUrl} from '../../utils/asset-url';

export class ShapeTool {
  getShapeByName(name: string): BasicShape | null {
    const shapes = state().config.tools?.shapes?.items;
    return shapes?.find(shape => shape.name === name) || null;
  }

  addBasicShape(shapeName: string): Object | null {
    const shape = this.getShapeByName(shapeName);
    if (!shape) return null;

    const {width, height, ...userConfig} =
      state().config.objectDefaults?.shape || {};

    const options: BasicShape['options'] = {
      ...userConfig,
      ...shape.options,
    };

    let fabricShape: Object;

    if (shape.name === 'circle') {
      fabricShape = new fabric.Circle({
        ...options,
        radius: 100,
      });
    } else if (shape.name === 'ellipse') {
      fabricShape = new fabric.Ellipse({
        ...options,
        rx: 100,
        ry: 50,
      });
    } else if (shape.type === 'Path') {
      fabricShape = new fabric.Path((options as PathOptions).path, {
        // @ts-ignore
        displayName: shape.name,
        ...options,
      });
    } else {
      const shapeType = shape.type as 'Circle' | 'Rect';
      fabricShape = new fabric[shapeType]({
        ...options,
        width: 150,
        height: 150,
      });
    }

    this.addAndPositionShape(fabricShape, ObjectName.Shape, {width, height});
    return fabricShape;
  }

  addSticker(categoryName: string, name: number | string): Promise<void> {
    const category = state().config.tools?.stickers?.items?.find(
      cat => cat.name === categoryName
    );
    if (!category) return Promise.resolve();
    if (category.type === 'svg') {
      const url = stickerUrl(category, name);
      return this.addSvgSticker(url);
    }
    return this.addRegularSticker(category, name);
  }

  private addRegularSticker(
    category: StickerCategory,
    name: number | string
  ): Promise<void> {
    return new Promise(resolve => {
      fabric.util.loadImage(stickerUrl(category, name), img => {
        const {width, height, ...userConfig} =
          state().config.objectDefaults?.sticker || {};
        const sticker = new fabric.Image(img, userConfig);
        this.addAndPositionShape(sticker, ObjectName.Sticker, {width, height});
        resolve();
      });
    });
  }

  addSvgSticker(
    url: string,
    objectName: ObjectName = ObjectName.Sticker
  ): Promise<void> {
    return new Promise(resolve => {
      fabric.loadSVGFromURL(url, (objects, options) => {
        const {width, height, ...userConfig} =
          state().config.objectDefaults?.sticker || {};
        const sticker = fabric.util.groupSVGElements(objects, options);
        sticker.set(userConfig);
        this.addAndPositionShape(sticker, objectName, {width, height});
        resolve();
      });
    });
  }

  private addAndPositionShape(
    shape: Object,
    objectName: ObjectName,
    {width}: {width?: number; height?: number}
  ) {
    shape.name = objectName;
    shape.scaleX = 1;
    shape.scaleY = 1;
    fabricCanvas().add(shape);

    const newWidth = width || (state().original.width * state().zoom) / 4;
    shape.scaleToWidth(Math.min(150, newWidth));

    shape.viewportCenter();
    shape.setCoords();
    tools().canvas.render();
    fabricCanvas().setActiveObject(shape);
  }
}

export function stickerUrl(
  category: StickerCategory,
  stickerName: number | string
): string {
  return assetUrl(
    `images/stickers/${category.name}/${stickerName}.${category.type}`
  );
}
