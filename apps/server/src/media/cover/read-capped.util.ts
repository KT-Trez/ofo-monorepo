export async function readCapped(response: Response, maxBytes: number): Promise<Buffer> {
  if (!response.body) {
    throw new Error('Empty response body');
  }

  const chunks: Uint8Array[] = [];
  let total = 0;

  for await (const chunk of response.body) {
    total += chunk.byteLength;

    if (total > maxBytes) {
      throw new Error(`Thumbnail larger than ${maxBytes} bytes`);
    }

    chunks.push(chunk);
  }

  if (total === 0) {
    throw new Error('Empty response body');
  }

  return Buffer.concat(chunks, total);
}
