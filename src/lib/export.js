const resizeCanvas = (source, size) => {
  let current = source;
  let currentSize = source.width;
  while (currentSize > size * 2) {
    const half = Math.max(Math.floor(currentSize / 2), size);
    const tmp = document.createElement('canvas');
    tmp.width = half; tmp.height = half;
    const ctx = tmp.getContext('2d');
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(current, 0, 0, half, half);
    current = tmp; currentSize = half;
  }
  const out = document.createElement('canvas');
  out.width = size; out.height = size;
  const ctx = out.getContext('2d');
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(current, 0, 0, size, size);
  return out;
};

export const canvasToPngBlob = (source, size) => new Promise((resolve) => {
  resizeCanvas(source, size).toBlob(resolve, 'image/png');
});

export const buildIcns = async (canvas) => {
  const CHUNKS = [
    { ostype: 'icp4', size: 16 }, { ostype: 'icp5', size: 32 }, { ostype: 'icp6', size: 64 },
    { ostype: 'ic07', size: 128 }, { ostype: 'ic08', size: 256 }, { ostype: 'ic09', size: 512 },
    { ostype: 'ic10', size: 1024 }, { ostype: 'ic11', size: 32 }, { ostype: 'ic12', size: 64 },
    { ostype: 'ic13', size: 256 }, { ostype: 'ic14', size: 512 },
  ];
  const pngCache = {};
  const getPng = async (size) => {
    if (!pngCache[size]) {
      const blob = await canvasToPngBlob(canvas, size);
      pngCache[size] = new Uint8Array(await blob.arrayBuffer());
    }
    return pngCache[size];
  };
  const chunkBuffers = await Promise.all(CHUNKS.map(async ({ ostype, size }) => {
    const pngData = await getPng(size);
    const chunkLen = 8 + pngData.length;
    const buf = new Uint8Array(chunkLen);
    for (let i = 0; i < 4; i++) buf[i] = ostype.charCodeAt(i);
    new DataView(buf.buffer).setUint32(4, chunkLen, false);
    buf.set(pngData, 8);
    return buf;
  }));
  const totalDataLen = chunkBuffers.reduce((s, b) => s + b.length, 0);
  const icnsLen = 8 + totalDataLen;
  const icns = new Uint8Array(icnsLen);
  const dv = new DataView(icns.buffer);
  icns[0] = 0x69; icns[1] = 0x63; icns[2] = 0x6E; icns[3] = 0x73;
  dv.setUint32(4, icnsLen, false);
  let offset = 8;
  for (const chunk of chunkBuffers) { icns.set(chunk, offset); offset += chunk.length; }
  return new Blob([icns], { type: 'image/x-icns' });
};

export const buildIco = async (canvas) => {
  const SIZES = [16, 32, 48, 64, 128, 256];
  const pngBlobs = await Promise.all(SIZES.map(s => canvasToPngBlob(canvas, s)));
  const pngBuffers = await Promise.all(pngBlobs.map(b => b.arrayBuffer().then(ab => new Uint8Array(ab))));
  const headerSize = 6, dirEntrySize = 16;
  const dirSize = dirEntrySize * SIZES.length;
  const totalSize = headerSize + dirSize + pngBuffers.reduce((s, b) => s + b.length, 0);
  const buf = new ArrayBuffer(totalSize);
  const dv = new DataView(buf); const u8 = new Uint8Array(buf);
  dv.setUint16(0, 0, true); dv.setUint16(2, 1, true); dv.setUint16(4, SIZES.length, true);
  let dataOffset = headerSize + dirSize;
  SIZES.forEach((size, i) => {
    const png = pngBuffers[i]; const entryBase = headerSize + i * dirEntrySize;
    u8[entryBase] = size === 256 ? 0 : size; u8[entryBase + 1] = size === 256 ? 0 : size;
    u8[entryBase + 2] = 0; u8[entryBase + 3] = 0;
    dv.setUint16(entryBase + 4, 1, true); dv.setUint16(entryBase + 6, 32, true);
    dv.setUint32(entryBase + 8, png.length, true); dv.setUint32(entryBase + 12, dataOffset, true);
    u8.set(png, dataOffset); dataOffset += png.length;
  });
  return new Blob([buf], { type: 'image/x-icon' });
};
