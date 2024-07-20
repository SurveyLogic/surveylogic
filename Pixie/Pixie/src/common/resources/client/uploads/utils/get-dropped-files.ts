import {UploadedFile} from '../uploaded-file';

export async function getDroppedFiles(
  dataTransfer: DataTransfer
): Promise<UploadedFile[]> {
  let files: UploadedFile[] = [];

  if (dataTransfer.items?.[0] && 'webkitGetAsEntry' in dataTransfer.items[0]) {
    // need to make a copy if transfer items and get entry here, it
    // might not be available anymore in subsequent loop iterations
    const entries = [...dataTransfer.items].map(item => {
      return item.webkitGetAsEntry();
    });
    for (const entry of entries) {
      if (entry && !entry.isDirectory) {
        files.push(await filesystemEntryToFile(entry as FileSystemFileEntry));
      } else if (entry) {
        files = [
          ...files,
          ...(await readDirRecursive(entry as FileSystemDirectoryEntry)),
        ];
      }
    }
  } else {
    files = [...dataTransfer.files].map(f => new UploadedFile(f));
  }
  return files;
}

function filesystemEntryToFile(
  entry: FileSystemFileEntry
): Promise<UploadedFile> {
  return new Promise(resolve => {
    entry.file(file => {
      resolve(new UploadedFile(file, entry.fullPath));
    });
  });
}

async function readDirRecursive(
  entry: FileSystemDirectoryEntry,
  files: UploadedFile[] = []
) {
  const entries = await readEntries(entry);

  for (const childEntry of entries) {
    if (childEntry.isDirectory) {
      await readDirRecursive(childEntry as FileSystemDirectoryEntry, files);
    } else {
      files.push(
        await filesystemEntryToFile(childEntry as FileSystemFileEntry)
      );
    }
  }

  return files;
}

function readEntries(
  dir: FileSystemDirectoryEntry
): Promise<FileSystemEntry[]> {
  return new Promise(resolve => {
    drainDirReader(dir.createReader(), resolve);
  });
}

function drainDirReader(
  reader: FileSystemDirectoryReader,
  resolve: (value: FileSystemEntry[]) => void,
  allEntries: FileSystemEntry[] = []
) {
  // directory reader needs to be called repeatedly until it returns an empty array
  reader.readEntries(entries => {
    if (entries.length) {
      allEntries = [...allEntries, ...entries];
      drainDirReader(reader, resolve, allEntries);
    } else {
      resolve(allEntries);
    }
  });
}
