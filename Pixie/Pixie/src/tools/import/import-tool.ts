import {Image} from 'fabric/fabric-impl';
import {openUploadWindow} from '@common/uploads/utils/open-upload-window';
import {UploadedFile} from '@common/uploads/uploaded-file';
import {ObjectName} from '@app/objects/object-name';
import {SerializedPixieState} from '@app/tools/history/serialized-pixie-state';
import {addImage} from '@app/tools/canvas/add-image';
import {state, tools} from '@app/state/utils';
import {resetEditor} from '@app/utils/reset-editor';
import {UploadAccentProps} from '@common/uploads/utils/create-upload-input';
import {fetchStateJsonFromUrl} from '@app/tools/import/fetch-state-json-from-url';
import {UploadInputType} from '@common/uploads/types/upload-input-config';
import {validateUpload} from '@common/uploads/uploader/validate-upload';
import {convertToBytes} from '@common/uploads/utils/convert-to-bytes';
import {toast} from '@common/ui/toast/toast';
import {HistorySlice} from '@app/tools/history/state/history-slice';

export class ImportTool {
  /**
   * Open file upload window and add selected image to canvas.
   */
  async uploadAndAddImage(autoSelect: boolean = true): Promise<void> {
    const file = await this.openUploadWindow();
    await this.openUploadedFile(file, autoSelect);
  }

  /**
   * Open file upload window and replace canvas contents with selected image.
   */
  async uploadAndReplaceMainImage(): Promise<void> {
    const file = await this.openUploadWindow();
    if (file) {
      await this.openBackgroundImage(file);
    }
  }

  /**
   * Open file upload window and replace canvas contents with selected state file.
   */
  async uploadAndOpenStateFile(): Promise<void> {
    const file = await this.openUploadWindow(stateContentType);
    if (file) {
      await this.loadState(await file.data);
    }
  }

  /**
   * Add image at specified url to canvas.
   */
  async addImageFromUrl(url: string, select: boolean = true): Promise<void> {
    await addImage(
      url,
      state().config.tools?.import?.fitOverlayToScreen ?? true,
      select
    );
    tools().history.addHistoryItem({name: 'overlayImage'});
  }

  /**
   * Add specified image data to canvas.
   */
  async addImageFromData(data: string, select: boolean = true): Promise<void> {
    await addImage(
      data,
      state().config.tools?.import?.fitOverlayToScreen ?? true,
      select
    );
    tools().history.addHistoryItem({name: 'overlayImage'});
  }

  /**
   * @hidden
   */
  async openUploadedFile(
    file?: UploadedFile | null,
    autoSelect: boolean = true
  ) {
    if (!file) return;
    const fileData = await file.data;
    switch (file.extension) {
      case 'json':
        await this.loadState(fileData);
        break;
      case 'svg':
        await tools().shape.addSvgSticker(fileData, ObjectName.Image);
        tools().history.addHistoryItem({name: 'overlayImage'});
        break;
      default:
        await this.addImageFromData(fileData, autoSelect);
    }
  }

  /**
   * Replace current editor state with specified one.
   */
  async loadState(data: string | SerializedPixieState): Promise<void> {
    state().toggleLoading('state');
    await resetEditor();

    let stateObj: SerializedPixieState & {history?: HistorySlice['history']};

    if (typeof data === 'string') {
      if (data.endsWith('.json')) {
        stateObj = await fetchStateJsonFromUrl(data);
      } else {
        stateObj = JSON.parse(data);
      }
    } else {
      stateObj = data;
    }

    // in latest version full history store state is stored in .json file
    if (stateObj.history) {
      state().history.reset(stateObj.history);
      // in earlier versions only fabric history was stored
    } else {
      await tools().history.addInitial(stateObj);
    }
    await tools().history.reload();
    state().toggleLoading(false);
  }

  /**
   * @hidden
   */
  async openUploadWindow(
    contentTypes?: UploadAccentProps
  ): Promise<UploadedFile | null> {
    contentTypes = contentTypes || imgContentTypes();
    const file = (await openUploadWindow(contentTypes))[0];
    if (this.fileIsValid(file)) {
      state().config.onFileOpen?.(file);
      return file;
    }
    return null;
  }

  /**
   * Open specified data or image as background image.
   */
  async openBackgroundImage(
    image: UploadedFile | HTMLImageElement | string
  ): Promise<Image | undefined> {
    await resetEditor();
    let src: string;
    if (image instanceof HTMLImageElement) {
      src = image.src;
    } else if (image instanceof UploadedFile) {
      src = await image.data;
    } else {
      src = image;
    }
    const response = await tools().canvas.addMainImage(src);
    await tools().history.addInitial();
    return response;
  }

  fileIsValid(file: UploadedFile): boolean {
    const maxFileSize =
      state().config.tools?.import?.maxFileSize ?? convertToBytes(10, 'MB');
    const allowedFileTypes = [
      ...(state().config.tools?.import?.validImgExtensions ?? []),
      'json',
    ];
    const errorMessage = validateUpload(file, {maxFileSize, allowedFileTypes});
    if (errorMessage) {
      toast.danger(errorMessage);
      return false;
    }
    return true;
  }
}

export function imgContentTypes(): UploadAccentProps {
  const validExtensions = state().config.tools?.import?.validImgExtensions;
  if (validExtensions) {
    return {extensions: validExtensions};
  }
  return {types: [UploadInputType.image]};
}

export const stateContentType: UploadAccentProps = {
  types: ['.json', UploadInputType.json],
};
