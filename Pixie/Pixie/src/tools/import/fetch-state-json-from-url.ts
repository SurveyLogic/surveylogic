import {SerializedPixieState} from '../history/serialized-pixie-state';

export async function fetchStateJsonFromUrl(
  url: string
): Promise<SerializedPixieState> {
  const response = await fetch(url);
  return response.json();
}
