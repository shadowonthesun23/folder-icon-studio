export const loadSvgAsImage = (svgString) => new Promise((resolve, reject) => {
  const blob = new Blob([svgString], { type: 'image/svg+xml' });
  const url = URL.createObjectURL(blob);
  const img = new Image();
  img.onload = () => { URL.revokeObjectURL(url); resolve(img); };
  img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('SVG load failed')); };
  img.src = url;
});

export const loadPngAsImage = (url) => new Promise((resolve, reject) => {
  const img = new Image();
  img.onload = () => resolve(img);
  img.onerror = () => reject(new Error(`PNG load failed: ${url}`));
  img.src = url;
});

export const rgbToHex = (r, g, b) =>
  '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');

export const getDominantColor = (imgElement) => {
  const c = document.createElement('canvas');
  c.width = 64; c.height = 64;
  const ctx = c.getContext('2d');
  ctx.drawImage(imgElement, 0, 0, 64, 64);
  const data = ctx.getImageData(0, 0, 64, 64).data;
  let r = 0, g = 0, b = 0;
  const n = data.length / 4;
  for (let i = 0; i < data.length; i += 4) {
    r += data[i]; g += data[i + 1]; b += data[i + 2];
  }
  return rgbToHex(Math.round(r / n), Math.round(g / n), Math.round(b / n));
};
