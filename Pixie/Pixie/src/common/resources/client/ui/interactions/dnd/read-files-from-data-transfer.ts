import {UploadedFile} from '../../../uploads/uploaded-file';

export async function* readFilesFromDataTransfer(dataTransfer: DataTransfer) {
  for (const item of dataTransfer.items) {
    if (item.kind === 'file') {
      if (typeof item.webkitGetAsEntry === 'function') {
        const entry: FileSystemEntry | null = item.webkitGetAsEntry();
        if (!entry) continue;

        if (entry.isFile) {
          if (entry.name === '.DS_Store') continue;
          yield new UploadedFile(item.getAsFile()!, entry.fullPath);
        } else if (entry.isDirectory) {
          yield* getEntries(entry as FileSystemDirectoryEntry);
        }
      } else {
        const file = item.getAsFile();
        if (!file || file.name === '.DS_Store') continue;
        yield new UploadedFile(file, (item as any).fullPath);
      }
    }
  }
}

async function* getEntries(item: FileSystemDirectoryEntry): AsyncIterable<any> {
  const reader = item.createReader();

  // We must call readEntries repeatedly because there may be a limit to the
  // number of entries that are returned at once.
  let entries: FileSystemEntry[];
  do {
    entries = await new Promise((resolve, reject) => {
      reader.readEntries(resolve, reject);
    });

    for (const entry of entries) {
      if (entry.isFile) {
        if (entry.name === '.DS_Store') continue;
        const file = await getEntryFile(entry as FileSystemFileEntry);
        yield new UploadedFile(file, entry.fullPath);
      } else if (entry.isDirectory) {
        yield* getEntries(entry as FileSystemDirectoryEntry);
      }
    }
  } while (entries.length > 0);
}

function getEntryFile(entry: FileSystemFileEntry): Promise<File> {
  return new Promise((resolve, reject) => entry.file(resolve, reject));
}
