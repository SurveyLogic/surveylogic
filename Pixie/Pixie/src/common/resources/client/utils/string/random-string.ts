export function randomString(length: number = 36) {
  let random = '';
  const possible =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (let i = 0; i < length; i += 1) {
    random += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  return random;
}
