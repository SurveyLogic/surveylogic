export type SpaceUnit = 'KB' | 'MB' | 'GB' | 'TB' | 'PB';

export function convertToBytes(value: number, unit: SpaceUnit): number {
  if (value == null) return 0;
  switch (unit) {
    case 'KB':
      return value * 1024;
    case 'MB':
      return value * 1024 ** 2;
    case 'GB':
      return value * 1024 ** 3;
    case 'TB':
      return value * 1024 ** 4;
    case 'PB':
      return value * 1024 ** 5;
    default:
      return value;
  }
}
