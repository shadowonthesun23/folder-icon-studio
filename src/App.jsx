import { useState, useEffect, useRef, useCallback } from 'react';
import { Upload, Download, Type, Image as LucideImage, ZoomIn, Palette, Check, Move, RotateCw, Droplet, Coffee, RotateCcw, X, ChevronDown, Circle, Undo2, Redo2, BookmarkPlus, Bookmark, Trash2, Info } from 'lucide-react';
import { Analytics } from '@vercel/analytics/react';

const TRANSLATIONS = {
  it: {
    subtitle: 'Crea icone macOS customizzate.',
    section1: '1. Grafica',
    folderStyle: 'Stile cartella',
    folderColor: 'Colore cartella',
    defaultColor: 'Default',
    changeImage: 'Cambia immagine',
    uploadImage: 'Carica Immagine',
    uploadFormats: 'JPG, PNG, WEBP',
    zoom: 'Zoom',
    rotation: 'Rotazione',
    section2: '2. Etichetta',
    styleDymo: '🏷️ Dymo',
    styleBanner: '▬ Fascia',
    styleBadge: '● Badge',
    labelText: 'Testo (lascia vuoto per nascondere)',
    labelPlaceholder: 'Es. Progetto X',
    font: 'Font',
    fontSize: 'Dimensione',
    badgeSize: 'Dimensione badge',
    tapeAngle: 'Inclinazione nastro',
    resetTip: 'Ripristina',
    resetBtn: 'reset',
    dragHint: "Trascina l'etichetta in anteprima per riposizionarla",
    colorTape: 'Colore Nastro',
    colorBanner: 'Colore Fascia',
    colorBadge: 'Colore Badge',
    opacity: 'Opacità',
    download: 'Scarica',
    downloadPng: 'PNG 1024×1024',
    downloadIcns: 'ICNS (macOS)',
    downloadIco: 'ICO (Windows)',
    uploadHint: "Carica un'immagine per iniziare",
    dragCanvasHint: 'Clicca e trascina per posizionare',
    customColor: 'Colore personalizzato',
    coverRotation: 'Rotazione',
    removeImage: 'Rimuovi immagine',
    undo: 'Annulla',
    redo: 'Ripeti',
    section3: '3. Stili salvati',
    section3Hint: 'Salva i parametri grafici (etichetta, colori, font). L\'immagine non viene salvata.',
    savePreset: 'Salva stile',
    presetNamePlaceholder: 'Nome stile...',
    noPresets: 'Nessuno stile salvato',
    applyPreset: 'Applica',
    deletePreset: 'Elimina',
  },
  en: {
    subtitle: 'Create custom macOS icons.',
    section1: '1. Artwork',
    folderStyle: 'Folder style',
    folderColor: 'Folder color',
    defaultColor: 'Default',
    changeImage: 'Change Image',
    uploadImage: 'Upload Image',
    uploadFormats: 'JPG, PNG, WEBP',
    zoom: 'Zoom',
    rotation: 'Rotation',
    section2: '2. Label',
    styleDymo: '🏷️ Dymo',
    styleBanner: '▬ Banner',
    styleBadge: '● Badge',
    labelText: 'Text (leave empty to hide)',
    labelPlaceholder: 'e.g. Project X',
    font: 'Font',
    fontSize: 'Size',
    badgeSize: 'Badge size',
    tapeAngle: 'Tape angle',
    resetTip: 'Reset',
    resetBtn: 'reset',
    dragHint: 'Drag the label on the preview to reposition it',
    colorTape: 'Tape Color',
    colorBanner: 'Banner Color',
    colorBadge: 'Badge Color',
    opacity: 'Opacity',
    download: 'Download',
    downloadPng: 'PNG 1024×1024',
    downloadIcns: 'ICNS (macOS)',
    downloadIco: 'ICO (Windows)',
    uploadHint: 'Upload an image to get started',
    dragCanvasHint: 'Click and drag to position',
    customColor: 'Custom color',
    coverRotation: 'Rotation',
    removeImage: 'Remove image',
    undo: 'Undo',
    redo: 'Redo',
    section3: '3. Saved Styles',
    section3Hint: 'Saves graphic parameters (label, colors, font). The image is not saved.',
    savePreset: 'Save style',
    presetNamePlaceholder: 'Style name...',
    noPresets: 'No saved styles',
    applyPreset: 'Apply',
    deletePreset: 'Delete',
  }
};

const FOLDER_COLORS = [
  { id: 'default', hex: null, name: 'Default' },
  { id: 'blue', hex: '#4B8EF0', name: 'Blu' },
  { id: 'purple', hex: '#9B6EE8', name: 'Viola' },
  { id: 'pink', hex: '#E86E9B', name: 'Rosa' },
  { id: 'red', hex: '#E85E5E', name: 'Rosso' },
  { id: 'orange', hex: '#E8924B', name: 'Arancione' },
  { id: 'yellow', hex: '#E8C84B', name: 'Giallo' },
  { id: 'green', hex: '#5EBF6E', name: 'Verde' },
  { id: 'gray', hex: '#8E8E93', name: 'Grigio' },
];

// PNG cassette reale: 2185 × 1400
const CASSETTE_PNG_W = 2185;
const CASSETTE_PNG_H = 1400;

// Area label in coordinate PNG assolute (misurate in Photoshop con origine default)
const CASSETTE_LABEL_X = 136;
const CASSETTE_LABEL_Y = 101;
const CASSETTE_LABEL_W = 1911;
const CASSETTE_LABEL_H = 928;
const CASSETTE_LABEL_R = 0; // angoli retti — la sagoma reale non è stondata

const FOLDERS = {
  classic: {
    id: 'classic',
    name: 'Classica',
    tintFolder: true,
    svg: "<svg width='1024' height='1024' version='1.1' viewBox='0 0 16.933 16.933' xmlns='http://www.w3.org/2000/svg'><defs><filter id='filter9' x='-.0065174' y='-.075603' width='1.013' height='1.1512' color-interpolation-filters='sRGB'><feGaussianBlur stdDeviation='0.041672346'/></filter><filter id='filter11' x='-.0069629' y='-.043386' width='1.0139' height='1.0868' color-interpolation-filters='sRGB'><feGaussianBlur stdDeviation='0.044522292'/></filter><filter id='filter12' x='-.03226' y='-.045842' width='1.0645' height='1.0917' color-interpolation-filters='sRGB'><feGaussianBlur stdDeviation='0.13691812'/></filter><linearGradient id='a' x1='8.466' x2='8.466' y1='12.7' y2='2.381' gradientUnits='userSpaceOnUse'><stop offset='0'/><stop stop-opacity='0' offset='1'/></linearGradient><linearGradient id='b' x1='8.466' x2='8.466' y1='2.381' y2='5.5' gradientUnits='userSpaceOnUse'><stop stop-color='#5b9cf6' offset='0'/><stop stop-color='#4285f4' offset='1'/></linearGradient><linearGradient id='c' x1='8.467' x2='8.467' y1='4.498' y2='14.552' gradientUnits='userSpaceOnUse'><stop stop-color='#fff' offset='0'/><stop offset='1'/></linearGradient><linearGradient id='d' x1='8.467' x2='8.467' y1='4.498' y2='14.552' gradientUnits='userSpaceOnUse'><stop stop-color='#6aadff' offset='0'/><stop stop-color='#2171e8' offset='1'/></linearGradient></defs><g id='folder'><path d='m1.945 2.381h2.965c0.75 0 0.904 0.084 1.27 0.63 0.297 0.441 0.84 0.429 1.756 0.429h7.05a1.146 1.146 0 0 1 1.152 1.152v6.956a1.15 1.15 0 0 1-1.152 1.152h-13.042a1.15 1.15 0 0 1-1.15-1.152v-8.015a1.15 1.15 0 0 1 1.15-1.152z' fill='url(#b)'/><path d='m1.945 2.381h2.965c0.75 0 0.904 0.084 1.27 0.63 0.297 0.441 0.84 0.429 1.756 0.429h7.05a1.146 1.146 0 0 1 1.152 1.152v6.956a1.15 1.15 0 0 1-1.152 1.152h-13.042a1.15 1.15 0 0 1-1.15-1.152v-8.015a1.15 1.15 0 0 1 1.15-1.152z' fill='url(#a)'/><rect x='1.3229' y='3.9687' width='14.287' height='10.054' rx='.52916' ry='.52916' fill='none' filter='url(#filter12)' opacity='.1' stroke='#000000' stroke-width='.26458'/><rect x='1.3229' y='3.9687' width='14.287' height='10.054' rx='.52916' ry='.52916' fill='#ffffff' stroke-width='.9649'/><rect x='.794' y='4.498' width='15.346' height='10.054' rx='1.058' ry='1.058' fill='url(#d)'/><rect x='.793' y='4.498' width='15.346' height='10.054' rx='1.058' ry='1.058' fill='url(#c)' opacity='.15'/><path d='m1.852 4.4978c-0.5863 0-1.0583 0.47201-1.0583 1.0583v0.26458c0-0.5863 0.47201-1.0583 1.0583-1.0583h13.229c0.5863 0 1.0583 0.47201 1.0583 1.0583v-0.26458c0-0.5863-0.47201-1.0583-1.0583-1.0583z' fill='#ffffff' filter='url(#filter9)' opacity='.15'/><path transform='matrix(1,0,0,-1,0,19.05)' d='m1.852 4.4978c-0.5863 0-1.0583 0.47201-1.0583 1.0583v0.26458c0-0.5863 0.47201-1.0583 1.0583-1.0583h13.229c0.5863 0 1.0583 0.47201 1.0583 1.0583v-0.26458c0-0.5863-0.47201-1.0583-1.0583-1.0583z' fill='#000000' filter='url(#filter9)' opacity='.1'/><path d='m1.944 2.3812c-0.6363-6e-4 -1.1519 0.51554-1.1508 1.1518v0.26044c0.001104-0.63442 0.51587-1.1483 1.1508-1.1477h2.9672c0.75 0 0.90392 0.083623 1.2707 0.62992 0.2962 0.44122 0.83942 0.42839 1.7554 0.42839h7.0501c0.63356-0.00333 1.1486 0.50792 1.1518 1.14v-0.25269c0.0033-0.63761-0.51424-1.1552-1.1518-1.1518h-7.0501c-0.91599 0-1.4592 0.012831-1.7554-0.42839-0.36678-0.5463-0.5207-0.62992-1.2707-0.62992h-2.9672z' fill='#ffffff' filter='url(#filter11)' opacity='.25'/></g></svg>",
    getFolderRect: (cw, ch) => ({ x: 0, y: 0, w: cw, h: ch }),
    clipRect: { x: 0.794, y: 4.498, w: 15.346, h: 10.054, vw: 16.933, vh: 16.933 },
    buildFlapPath: (ctx, rect) => {
      const sX = rect.w / 16.933;
      const sY = rect.h / 16.933;
      const x = rect.x + 0.794 * sX;
      const y = rect.y + 4.498 * sY;
      const width = 15.346 * sX;
      const height = 10.054 * sY;
      const r = 1.058 * Math.min(sX, sY);
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.lineTo(x + width - r, y);
      ctx.arcTo(x + width, y, x + width, y + height, r);
      ctx.lineTo(x + width, y + height - r);
      ctx.arcTo(x + width, y + height, x, y + height, r);
      ctx.lineTo(x + r, y + height);
      ctx.arcTo(x, y + height, x, y, r);
      ctx.lineTo(x, y + r);
      ctx.arcTo(x, y, x + width, y, r);
      ctx.closePath();
    }
  },
  cassette: {
    id: 'cassette',
    name: 'Cassetta',
    tintFolder: false,
    url: null,
    getFolderRect: (cw, ch) => {
      const pngRatio = CASSETTE_PNG_W / CASSETTE_PNG_H;
      let w, h, x, y;
      if (cw / ch > pngRatio) {
        h = ch;
        w = h * pngRatio;
        x = (cw - w) / 2;
        y = 0;
      } else {
        w = cw;
        h = w / pngRatio;
        x = 0;
        y = (ch - h) / 2;
      }
      return { x, y, w, h };
    },
    clipRect: {
      x: CASSETTE_LABEL_X,
      y: CASSETTE_LABEL_Y,
      w: CASSETTE_LABEL_W,
      h: CASSETTE_LABEL_H,
      vw: CASSETTE_PNG_W,
      vh: CASSETTE_PNG_H,
    },
    // buildFlapPath usato solo per banner label — NON per clippare l'immagine utente
    buildFlapPath: (ctx, rect) => {
      const sX = rect.w / CASSETTE_PNG_W;
      const sY = rect.h / CASSETTE_PNG_H;
      const x = rect.x + CASSETTE_LABEL_X * sX;
      const y = rect.y + CASSETTE_LABEL_Y * sY;
      const w = CASSETTE_LABEL_W * sX;
      const h = CASSETTE_LABEL_H * sY;
      // angoli retti: nessun arcTo
      ctx.beginPath();
      ctx.rect(x, y, w, h);
      ctx.closePath();
    },
  }
};

const TAPE_COLORS = [
  { id: 'vintage', hex: '#f4ebd0', name: 'Vintage' },
  { id: 'white', hex: '#ffffff', name: 'Bianco' },
  { id: 'yellow', hex: '#ffeb3b', name: 'Giallo' },
  { id: 'orange', hex: '#ff9800', name: 'Arancione' },
  { id: 'red', hex: '#f44336', name: 'Rosso' }
];

const FONT_OPTIONS = [
  { id: 'space-mono', family: 'Space Mono', label: 'Mono' },
  { id: 'inter', family: 'Inter', label: 'Sans' },
  { id: 'permanent-marker', family: 'Permanent Marker', label: 'Hand' },
  { id: 'playfair', family: 'Playfair Display', label: 'Serif' },
];

const HISTORY_CAP = 50;
const LS_PRESETS_KEY = 'fis_presets';

const rgbToHex = (r, g, b) => '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');

const getTapeTextColor = (hex) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? '#111827' : '#ffffff';
};

const loadSvgAsImage = (svgString) => new Promise((resolve, reject) => {
  const blob = new Blob([svgString], { type: 'image/svg+xml' });
  const url = URL.createObjectURL(blob);
  const img = new Image();
  img.onload = () => { URL.revokeObjectURL(url); resolve(img); };
  img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('SVG load failed')); };
  img.src = url;
});

const loadPngAsImage = (url) => new Promise((resolve, reject) => {
  const img = new Image();
  img.onload = () => resolve(img);
  img.onerror = () => reject(new Error(`PNG load failed: ${url}`));
  img.src = url;
});

// ─── Export helpers ──────────────────────────────────────────────────────────

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

const canvasToPngBlob = (source, size) => new Promise((resolve) => {
  resizeCanvas(source, size).toBlob(resolve, 'image/png');
});

const buildIcns = async (canvas) => {
  const CHUNKS = [
    { ostype: 'icp4', size: 16 }, { ostype: 'icp5', size: 32 }, { ostype: 'icp6', size: 64 },
    { ostype: 'ic07', size: 128 }, { ostype: 'ic08', size: 256 }, { ostype: 'ic09', size: 512 },
    { ostype: 'ic10', size: 1024 }, { ostype: 'ic11', size: 32 }, { ostype: 'ic12', size: 64 },
    { ostype: 'ic13', size: 256 }, { ostype: 'ic14', size: 512 },
  ];
  const pngCache = {};
  const getPng = async (size) => {
    if (!pngCache[size]) { const blob = await canvasToPngBlob(canvas, size); pngCache[size] = new Uint8Array(await blob.arrayBuffer()); }
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

const buildIco = async (canvas) => {
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

// ─── Canvas drawing helpers ──────────────────────────────────────────────────

const drawTape = (ctx, w, h, text, tapeHex, opacity, tapeOffsetX, tapeOffsetY, tapeRotationDeg, fontSizeMultiplier, fontFamily) => {
  const tapeW = w * 0.55, tapeH = h * 0.12;
  const tapeBaseX = w / 2 - tapeW / 2, tapeBaseY = h * 0.55 - tapeH / 2;
  const x = tapeBaseX + tapeOffsetX, y = tapeBaseY + tapeOffsetY;
  ctx.save();
  ctx.translate(x + tapeW / 2, y + tapeH / 2);
  ctx.rotate((tapeRotationDeg * Math.PI) / 180);
  ctx.translate(-(x + tapeW / 2), -(y + tapeH / 2));
  ctx.shadowColor = 'rgba(0,0,0,0.3)'; ctx.shadowBlur = 15; ctx.shadowOffsetY = 5;
  ctx.fillStyle = tapeHex;
  ctx.beginPath();
  const zigs = 14, zigH = tapeH / zigs;
  ctx.moveTo(x, y);
  for (let i = 1; i <= zigs; i++) ctx.lineTo(x + (i % 2 === 0 ? 0 : 8), y + i * zigH);
  ctx.lineTo(x + tapeW, y + tapeH);
  for (let i = zigs - 1; i >= 0; i--) ctx.lineTo(x + tapeW - (i % 2 === 0 ? 0 : 8), y + i * zigH);
  ctx.lineTo(x, y); ctx.closePath();
  ctx.globalAlpha = opacity; ctx.fill(); ctx.globalAlpha = 1;
  ctx.shadowColor = 'transparent';
  ctx.fillStyle = getTapeTextColor(tapeHex);
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  let fontSize = tapeH * 0.55 * fontSizeMultiplier;
  ctx.font = `bold ${fontSize}px "${fontFamily}", sans-serif`;
  while (ctx.measureText(text).width > tapeW * 0.85 && fontSize > 10) { fontSize -= 2; ctx.font = `bold ${fontSize}px "${fontFamily}", sans-serif`; }
  ctx.fillText(text, x + tapeW / 2, y + tapeH / 2);
  ctx.restore();
};

const drawBanner = (ctx, shape, folderRect, text, tapeHex, opacity, fontSizeMultiplier, fontFamily) => {
  const { clipRect } = shape;
  const scaleX = folderRect.w / clipRect.vw, scaleY = folderRect.h / clipRect.vh;
  const rectX = folderRect.x + clipRect.x * scaleX, rectY = folderRect.y + clipRect.y * scaleY;
  const rectW = clipRect.w * scaleX, rectH = clipRect.h * scaleY;
  const bannerH = rectH * 0.30, bannerY = rectY + rectH - bannerH;
  ctx.save();
  shape.buildFlapPath(ctx, folderRect); ctx.clip();
  ctx.globalAlpha = opacity; ctx.fillStyle = tapeHex;
  ctx.fillRect(rectX, bannerY, rectW, bannerH);
  ctx.globalAlpha = 1;
  ctx.fillStyle = getTapeTextColor(tapeHex);
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  const words = text.split(' ');
  let lines = [text];
  let baseFontSize = bannerH * 0.28 * fontSizeMultiplier;
  ctx.font = `bold ${baseFontSize}px "${fontFamily}", sans-serif`;
  if (words.length > 1 && ctx.measureText(text).width > rectW * 0.88) {
    const mid = Math.ceil(words.length / 2);
    lines = [words.slice(0, mid).join(' '), words.slice(mid).join(' ')];
  }
  lines.forEach((line, i) => {
    let fs = baseFontSize;
    ctx.font = `bold ${fs}px "${fontFamily}", sans-serif`;
    while (ctx.measureText(line).width > rectW * 0.88 && fs > 10) { fs -= 2; ctx.font = `bold ${fs}px "${fontFamily}", sans-serif`; }
    ctx.fillText(line, rectX + rectW / 2, bannerY + bannerH * ((i + 1) / (lines.length + 1)));
  });
  ctx.restore();
};

const drawBadge = (ctx, w, h, text, badgeHex, opacity, badgeOffsetX, badgeOffsetY, radius, fontSizeMultiplier, fontFamily) => {
  const cx = w / 2 + badgeOffsetX, cy = h * 0.72 + badgeOffsetY;
  ctx.save();
  ctx.shadowColor = 'rgba(0,0,0,0.45)'; ctx.shadowBlur = 18; ctx.shadowOffsetX = 3; ctx.shadowOffsetY = 6;
  ctx.globalAlpha = opacity; ctx.fillStyle = badgeHex;
  ctx.beginPath(); ctx.arc(cx, cy, radius, 0, Math.PI * 2); ctx.closePath(); ctx.fill();
  ctx.shadowColor = 'transparent'; ctx.shadowBlur = 0; ctx.shadowOffsetX = 0; ctx.shadowOffsetY = 0; ctx.globalAlpha = 1;
  const highlight = ctx.createRadialGradient(cx - radius * 0.2, cy - radius * 0.3, radius * 0.1, cx, cy, radius);
  highlight.addColorStop(0, 'rgba(255,255,255,0.18)'); highlight.addColorStop(0.5, 'rgba(255,255,255,0.04)'); highlight.addColorStop(1, 'rgba(0,0,0,0.0)');
  ctx.globalAlpha = opacity; ctx.fillStyle = highlight;
  ctx.beginPath(); ctx.arc(cx, cy, radius, 0, Math.PI * 2); ctx.fill(); ctx.globalAlpha = 1;
  ctx.fillStyle = getTapeTextColor(badgeHex);
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  const words = text.trim().split(' ');
  let lines = [text];
  let baseFontSize = radius * 0.38 * fontSizeMultiplier;
  const maxWidth = radius * 1.5;
  ctx.font = `bold ${baseFontSize}px "${fontFamily}", sans-serif`;
  if (words.length > 1 && ctx.measureText(text).width > maxWidth) {
    const mid = Math.ceil(words.length / 2);
    lines = [words.slice(0, mid).join(' '), words.slice(mid).join(' ')];
  }
  lines.forEach((line, i) => {
    let fs = baseFontSize;
    ctx.font = `bold ${fs}px "${fontFamily}", sans-serif`;
    while (ctx.measureText(line).width > maxWidth && fs > 8) { fs -= 2; ctx.font = `bold ${fs}px "${fontFamily}", sans-serif`; }
    const lineH = fs * 1.2, totalH = lineH * lines.length;
    ctx.fillText(line, cx, cy - totalH / 2 + lineH * i + lineH / 2);
  });
  ctx.restore();
};

const IconX = ({ size = 16, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M4 4l11.733 16h4.267L8.267 4z" /><path d="M4 20l6.768-6.768m2.46-2.46L20 4" />
  </svg>
);

const IconInstagram = ({ size = 16, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

// ─── Preset helpers ──────────────────────────────────────────────────────────

const loadPresetsFromStorage = () => {
  try {
    const raw = localStorage.getItem(LS_PRESETS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
};

const savePresetsToStorage = (presets) => {
  try { localStorage.setItem(LS_PRESETS_KEY, JSON.stringify(presets)); } catch {}
};

const makeSnapshot = (s) => ({ ...s });

const captureThumbnail = (canvas) => {
  if (!canvas) return null;
  try {
    const thumb = document.createElement('canvas');
    thumb.width = 48; thumb.height = 48;
    const ctx = thumb.getContext('2d');
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(canvas, 0, 0, 48, 48);
    return thumb.toDataURL('image/png');
  } catch { return null; }
};

export default function App() {
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const downloadMenuRef = useRef(null);
  const [baseImgData, setBaseImgData] = useState(null);
  const [cassetteBaseImg, setCassetteBaseImg] = useState(null);
  const [cassetteOverlayImg, setCassetteOverlayImg] = useState(null);
  const [coverSrc, setCoverSrc] = useState(null);
  const [coverImg, setCoverImg] = useState(null);
  const [label, setLabel] = useState('Archivio 01');
  const [labelStyle, setLabelStyle] = useState('dymo');
  const [tapeColor, setTapeColor] = useState('#f4ebd0');
  const [tapeOpacity, setTapeOpacity] = useState(1);
  const [tapeRotation, setTapeRotation] = useState(-2.3);
  const [fontSizeMultiplier, setFontSizeMultiplier] = useState(1);
  const [fontFamily, setFontFamily] = useState('Space Mono');
  const [dominantColor, setDominantColor] = useState(null);
  const [folderColorOverride, setFolderColorOverride] = useState(null);
  const [customFolderColor, setCustomFolderColor] = useState('#4B8EF0');
  const [folderShape, setFolderShape] = useState('classic');
  const [coverOffset, setCoverOffset] = useState({ x: 0, y: 0 });
  const [coverScale, setCoverScale] = useState(1);
  const [coverRotation, setCoverRotation] = useState(0);
  const [tapeOffset, setTapeOffset] = useState({ x: 0, y: 0 });
  const [badgeOffset, setBadgeOffset] = useState({ x: 0, y: 0 });
  const [badgeSize, setBadgeSize] = useState(160);
  const [downloadMenuOpen, setDownloadMenuOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [historyIndex, setHistoryIndex] = useState(0);
  const draggingRef = useRef(null);
  const dragStartPosRef = useRef({ x: 0, y: 0 });
  const folderColorInputRef = useRef(null);
  const tapeColorInputRef = useRef(null);
  const historyRef = useRef([]);
  const historyIndexRef = useRef(0);
  const sliderDebounceRef = useRef({});
  const isRestoringRef = useRef(false);

  // ─── Preset state ────────────────────────────────────────────────────────────
  const [presets, setPresets] = useState(() => loadPresetsFromStorage());
  const [presetName, setPresetName] = useState('');
  const [presetsOpen, setPresetsOpen] = useState(false);
  const [section3HintVisible, setSection3HintVisible] = useState(false);

  // ─── stateRef: always-current snapshot ──────────────────────────────────────
  const stateRef = useRef({
    label: 'Archivio 01', labelStyle: 'dymo', tapeColor: '#f4ebd0', tapeOpacity: 1,
    tapeRotation: -2.3, fontSizeMultiplier: 1, fontFamily: 'Space Mono',
    tapeOffset: { x: 0, y: 0 }, badgeOffset: { x: 0, y: 0 }, badgeSize: 160,
    coverOffset: { x: 0, y: 0 }, coverScale: 1, coverRotation: 0, folderColorOverride: null,
  });

  const [lang, setLang] = useState(() => {
    try { return localStorage.getItem('fis_lang') || 'it'; } catch { return 'it'; }
  });

  const t = TRANSLATIONS[lang];
  const effectiveTintColor = folderColorOverride ?? dominantColor ?? null;

  useEffect(() => {
    stateRef.current = {
      label, labelStyle, tapeColor, tapeOpacity, tapeRotation,
      fontSizeMultiplier, fontFamily, tapeOffset, badgeOffset, badgeSize,
      coverOffset, coverScale, coverRotation, folderColorOverride,
    };
  });

  // ─── History core ──────────────────────────────────────────────────────────

  const pushHistory = useCallback((snap) => {
    if (isRestoringRef.current) return;
    const stack = historyRef.current;
    const idx = historyIndexRef.current;
    const newStack = stack.slice(0, idx + 1);
    newStack.push(snap);
    if (newStack.length > HISTORY_CAP) newStack.shift();
    historyRef.current = newStack;
    historyIndexRef.current = newStack.length - 1;
    setHistoryIndex(newStack.length - 1);
  }, []);

  const applySnapshot = useCallback((snap) => {
    isRestoringRef.current = true;
    setLabel(snap.label);
    setLabelStyle(snap.labelStyle);
    setTapeColor(snap.tapeColor);
    setTapeOpacity(snap.tapeOpacity);
    setTapeRotation(snap.tapeRotation);
    setFontSizeMultiplier(snap.fontSizeMultiplier);
    setFontFamily(snap.fontFamily);
    setTapeOffset(snap.tapeOffset);
    setBadgeOffset(snap.badgeOffset);
    setBadgeSize(snap.badgeSize);
    setCoverOffset(snap.coverOffset);
    setCoverScale(snap.coverScale);
    setCoverRotation(snap.coverRotation);
    setFolderColorOverride(snap.folderColorOverride);
    setTimeout(() => { isRestoringRef.current = false; }, 0);
  }, []);

  const undo = useCallback(() => {
    const idx = historyIndexRef.current;
    if (idx <= 0) return;
    const newIdx = idx - 1;
    historyIndexRef.current = newIdx;
    setHistoryIndex(newIdx);
    applySnapshot(historyRef.current[newIdx]);
  }, [applySnapshot]);

  const redo = useCallback(() => {
    const idx = historyIndexRef.current;
    const stack = historyRef.current;
    if (idx >= stack.length - 1) return;
    const newIdx = idx + 1;
    historyIndexRef.current = newIdx;
    setHistoryIndex(newIdx);
    applySnapshot(stack[newIdx]);
  }, [applySnapshot]);

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < historyRef.current.length - 1;

  useEffect(() => {
    if (historyRef.current.length === 0) {
      historyRef.current = [makeSnapshot(stateRef.current)];
      historyIndexRef.current = 0;
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const pushDebounced = useCallback((key, snap) => {
    if (sliderDebounceRef.current[key]) clearTimeout(sliderDebounceRef.current[key]);
    sliderDebounceRef.current[key] = setTimeout(() => { pushHistory(snap); }, 600);
  }, [pushHistory]);

  // ─── Preset actions ──────────────────────────────────────────────────────────

  const handleSavePreset = () => {
    const name = presetName.trim() || `Stile ${presets.length + 1}`;
    const thumbnail = captureThumbnail(canvasRef.current);
    const newPreset = {
      id: Date.now(),
      name,
      thumbnail,
      ...makeSnapshot(stateRef.current),
    };
    const updated = [...presets, newPreset];
    setPresets(updated);
    savePresetsToStorage(updated);
    setPresetName('');
  };

  const handleApplyPreset = (preset) => {
    const { id, name, thumbnail, ...snap } = preset;
    applySnapshot(snap);
    pushHistory(makeSnapshot(snap));
  };

  const handleDeletePreset = (id) => {
    const updated = presets.filter(p => p.id !== id);
    setPresets(updated);
    savePresetsToStorage(updated);
  };

  // ─── Keyboard shortcuts ──────────────────────────────────────────────────────

  useEffect(() => {
    const handler = (e) => {
      const mod = e.metaKey || e.ctrlKey;
      if (!mod) return;
      if (e.key === 'z' && !e.shiftKey) { e.preventDefault(); undo(); }
      if ((e.key === 'z' && e.shiftKey) || e.key === 'y') { e.preventDefault(); redo(); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [undo, redo]);

  const switchLang = (l) => { setLang(l); try { localStorage.setItem('fis_lang', l); } catch {} };

  useEffect(() => {
    if (!downloadMenuOpen) return;
    const handler = (e) => {
      if (downloadMenuRef.current && !downloadMenuRef.current.contains(e.target)) setDownloadMenuOpen(false);
    };
    document.addEventListener('pointerdown', handler);
    return () => document.removeEventListener('pointerdown', handler);
  }, [downloadMenuOpen]);

  const handleClearImage = () => {
    if (coverSrc && coverSrc.startsWith('blob:')) URL.revokeObjectURL(coverSrc);
    setCoverSrc(null); setCoverImg(null);
    setCoverOffset({ x: 0, y: 0 }); setCoverScale(1); setCoverRotation(0); setDominantColor(null);
  };

  const updateCursor = (isDragging) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.style.cursor = isDragging ? 'grabbing' : coverSrc ? 'grab' : 'default';
  };

  useEffect(() => { updateCursor(false); }, [coverSrc]);

  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Mono:ital,wght@0,400;0,700;1,400&family=Permanent+Marker&family=Playfair+Display:wght@700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  }, []);

  // ─── Load folder base image (SVG o PNG cassette) ──────────────────────────
  useEffect(() => {
    const shape = FOLDERS[folderShape];
    setBaseImgData(null);
    if (folderShape === 'cassette') {
      return;
    }
    loadSvgAsImage(shape.svg).then(img => setBaseImgData(img)).catch(err => console.error('Folder load error:', err));
  }, [folderShape]);

  // ─── Load cassette PNGs ──────────────────────────────────────────────────
  useEffect(() => {
    if (folderShape !== 'cassette') return;
    setCassetteBaseImg(null);
    setCassetteOverlayImg(null);
    Promise.all([
      loadPngAsImage('/cassette-base.png'),
      loadPngAsImage('/cassette-overlay.png'),
    ]).then(([base, overlay]) => {
      setCassetteBaseImg(base);
      setCassetteOverlayImg(overlay);
    }).catch(err => console.error('Cassette PNG load error:', err));
  }, [folderShape]);

  useEffect(() => {
    if (!coverSrc) { setCoverImg(null); return; }
    setCoverImg(null);
    const img = new Image();
    img.onload = () => setCoverImg(img);
    img.src = coverSrc;
  }, [coverSrc]);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (coverSrc && coverSrc.startsWith('blob:')) URL.revokeObjectURL(coverSrc);
    const objectUrl = URL.createObjectURL(file);
    setCoverSrc(objectUrl); setCoverOffset({ x: 0, y: 0 }); setCoverScale(1); setCoverRotation(0);
    const img = new Image();
    img.onload = () => {
      const c = document.createElement('canvas'); c.width = 64; c.height = 64;
      const ctx = c.getContext('2d'); ctx.drawImage(img, 0, 0, 64, 64);
      const data = ctx.getImageData(0, 0, 64, 64).data;
      let r = 0, g = 0, b = 0; const n = data.length / 4;
      for (let i = 0; i < data.length; i += 4) { r += data[i]; g += data[i+1]; b += data[i+2]; }
      setDominantColor(rgbToHex(Math.round(r/n), Math.round(g/n), Math.round(b/n)));
    };
    img.src = objectUrl;
    e.target.value = '';
  };

  const handlePointerDown = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width, scaleY = canvas.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX, y = (e.clientY - rect.top) * scaleY;
    if (labelStyle === 'dymo') {
      const tapeW = canvas.width * 0.55, tapeH = canvas.height * 0.12;
      const tX = canvas.width / 2 - tapeW / 2 + tapeOffset.x, tY = canvas.height * 0.55 - tapeH / 2 + tapeOffset.y;
      if (label.trim() !== '' && x >= tX && x <= tX + tapeW && y >= tY && y <= tY + tapeH) draggingRef.current = 'tape';
      else if (coverSrc) draggingRef.current = 'cover';
    } else if (labelStyle === 'badge') {
      const bcx = canvas.width / 2 + badgeOffset.x, bcy = canvas.height * 0.72 + badgeOffset.y;
      const dist = Math.sqrt((x - bcx) ** 2 + (y - bcy) ** 2);
      if (label.trim() !== '' && dist <= badgeSize) draggingRef.current = 'badge';
      else if (coverSrc) draggingRef.current = 'cover';
    } else if (coverSrc) {
      draggingRef.current = 'cover';
    }
    if (draggingRef.current) updateCursor(true);
    dragStartPosRef.current = { x: e.clientX, y: e.clientY };
    if (e.target.setPointerCapture) e.target.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e) => {
    if (!draggingRef.current) return;
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width, scaleY = canvas.height / rect.height;
    const dx = (e.clientX - dragStartPosRef.current.x) * scaleX;
    const dy = (e.clientY - dragStartPosRef.current.y) * scaleY;
    if (draggingRef.current === 'tape') setTapeOffset(p => ({ x: p.x + dx, y: p.y + dy }));
    else if (draggingRef.current === 'badge') setBadgeOffset(p => ({ x: p.x + dx, y: p.y + dy }));
    else if (draggingRef.current === 'cover') setCoverOffset(p => ({ x: p.x + dx, y: p.y + dy }));
    dragStartPosRef.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerUp = useCallback((e) => {
    const wasTarget = draggingRef.current;
    draggingRef.current = null;
    updateCursor(false);
    if (e.target.releasePointerCapture) e.target.releasePointerCapture(e.pointerId);
    if (wasTarget) {
      requestAnimationFrame(() => {
        pushHistory(makeSnapshot(stateRef.current));
      });
    }
  }, [pushHistory]);

  // ─── Main render ──────────────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (folderShape === 'cassette') {
      if (!cassetteBaseImg) return;
    } else {
      if (!baseImgData) return;
    }
    const ctx = canvas.getContext('2d');
    const w = canvas.width, h = canvas.height;
    const shape = FOLDERS[folderShape];
    const folderRect = shape.getFolderRect(w, h);

    ctx.clearRect(0, 0, w, h);

    if (folderShape === 'cassette') {
      // 1. Disegna base cassetta
      ctx.drawImage(cassetteBaseImg, folderRect.x, folderRect.y, folderRect.w, folderRect.h);

      // 2. Disegna immagine utente SENZA clip geometrico:
      //    l'overlay PNG coprirà ingranaggi, nastro e bordi naturalmente
      if (coverImg) {
        const { clipRect } = shape;
        const rectX = folderRect.x + clipRect.x * (folderRect.w / clipRect.vw);
        const rectY = folderRect.y + clipRect.y * (folderRect.h / clipRect.vh);
        const rectW = clipRect.w * (folderRect.w / clipRect.vw);
        const rectH = clipRect.h * (folderRect.h / clipRect.vh);
        const imgRatio = coverImg.width / coverImg.height;
        const canvasRatio = rectW / rectH;
        let drawW, drawH;
        if (imgRatio > canvasRatio) { drawH = rectH * coverScale; drawW = drawH * imgRatio; }
        else { drawW = rectW * coverScale; drawH = drawW / imgRatio; }
        const drawX = rectX + (rectW - drawW) / 2 + coverOffset.x;
        const drawY = rectY + (rectH - drawH) / 2 + coverOffset.y;
        ctx.save();
        ctx.translate(drawX + drawW / 2, drawY + drawH / 2);
        ctx.rotate((coverRotation * Math.PI) / 180);
        ctx.translate(-(drawX + drawW / 2), -(drawY + drawH / 2));
        ctx.drawImage(coverImg, drawX, drawY, drawW, drawH);
        ctx.restore();
      }

      // 3. Overlay PNG sopra tutto: copre cornice, ingranaggi, nastro e bordi
      if (cassetteOverlayImg) {
        ctx.drawImage(cassetteOverlayImg, folderRect.x, folderRect.y, folderRect.w, folderRect.h);
      }
    } else {
      // Pipeline standard (classic)
      if (shape.tintFolder && effectiveTintColor) {
        const offscreen = document.createElement('canvas');
        offscreen.width = w; offscreen.height = h;
        const offCtx = offscreen.getContext('2d');
        offCtx.drawImage(baseImgData, folderRect.x, folderRect.y, folderRect.w, folderRect.h);
        offCtx.globalCompositeOperation = 'color';
        offCtx.fillStyle = effectiveTintColor;
        offCtx.fillRect(folderRect.x, folderRect.y, folderRect.w, folderRect.h);
        offCtx.globalCompositeOperation = 'destination-in';
        offCtx.drawImage(baseImgData, folderRect.x, folderRect.y, folderRect.w, folderRect.h);
        ctx.drawImage(offscreen, 0, 0);
      } else {
        ctx.drawImage(baseImgData, folderRect.x, folderRect.y, folderRect.w, folderRect.h);
      }
      if (coverImg) {
        ctx.save();
        shape.buildFlapPath(ctx, folderRect); ctx.clip();
        const { clipRect } = shape;
        const rectX = folderRect.x + clipRect.x * (folderRect.w / clipRect.vw);
        const rectY = folderRect.y + clipRect.y * (folderRect.h / clipRect.vh);
        const rectW = clipRect.w * (folderRect.w / clipRect.vw);
        const rectH = clipRect.h * (folderRect.h / clipRect.vh);
        const imgRatio = coverImg.width / coverImg.height;
        const canvasRatio = rectW / rectH;
        let drawW, drawH;
        if (imgRatio > canvasRatio) { drawH = rectH * coverScale; drawW = drawH * imgRatio; }
        else { drawW = rectW * coverScale; drawH = drawW / imgRatio; }
        const drawX = rectX + (rectW - drawW) / 2 + coverOffset.x;
        const drawY = rectY + (rectH - drawH) / 2 + coverOffset.y;
        ctx.save();
        ctx.translate(drawX + drawW / 2, drawY + drawH / 2);
        ctx.rotate((coverRotation * Math.PI) / 180);
        ctx.translate(-(drawX + drawW / 2), -(drawY + drawH / 2));
        ctx.drawImage(coverImg, drawX, drawY, drawW, drawH);
        ctx.restore();
        const shadow = ctx.createLinearGradient(0, rectY, 0, rectY + rectH);
        shadow.addColorStop(0, 'rgba(255,255,255,0.15)'); shadow.addColorStop(0.1, 'rgba(0,0,0,0)');
        shadow.addColorStop(0.9, 'rgba(0,0,0,0)'); shadow.addColorStop(1, 'rgba(0,0,0,0.35)');
        ctx.fillStyle = shadow; ctx.fillRect(rectX, rectY, rectW, rectH);
        ctx.restore();
      }
    }

    // Etichette (comuni a tutti gli stili)
    if (label.trim() !== '') {
      if (labelStyle === 'dymo') drawTape(ctx, w, h, label, tapeColor, tapeOpacity, tapeOffset.x, tapeOffset.y, tapeRotation, fontSizeMultiplier, fontFamily);
      else if (labelStyle === 'banner') drawBanner(ctx, shape, folderRect, label, tapeColor, tapeOpacity, fontSizeMultiplier, fontFamily);
      else if (labelStyle === 'badge') drawBadge(ctx, w, h, label, tapeColor, tapeOpacity, badgeOffset.x, badgeOffset.y, badgeSize, fontSizeMultiplier, fontFamily);
    }
  }, [baseImgData, cassetteBaseImg, cassetteOverlayImg, coverImg, label, labelStyle, tapeColor, tapeOpacity, effectiveTintColor, coverOffset, coverScale, coverRotation, tapeOffset, badgeOffset, badgeSize, folderShape, tapeRotation, fontSizeMultiplier, fontFamily]);

  const getFileName = () => (label.trim() === '' ? 'icon' : label).replace(/\s+/g, '_').toLowerCase();

  const handleDownloadPng = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `folder_${getFileName()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click(); setDownloadMenuOpen(false);
  };

  const handleDownloadIcns = async () => {
    const canvas = canvasRef.current; if (!canvas) return;
    setIsExporting(true); setDownloadMenuOpen(false);
    try {
      const blob = await buildIcns(canvas);
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.download = `folder_${getFileName()}.icns`; link.href = url; link.click();
      setTimeout(() => URL.revokeObjectURL(url), 5000);
    } finally { setIsExporting(false); }
  };

  const handleDownloadIco = async () => {
    const canvas = canvasRef.current; if (!canvas) return;
    setIsExporting(true); setDownloadMenuOpen(false);
    try {
      const blob = await buildIco(canvas);
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.download = `folder_${getFileName()}.ico`; link.href = url; link.click();
      setTimeout(() => URL.revokeObjectURL(url), 5000);
    } finally { setIsExporting(false); }
  };

  const isPresetColor = TAPE_COLORS.some(c => c.hex === tapeColor);
  const isCustomFolderColor = folderColorOverride !== null && !FOLDER_COLORS.slice(1).some(c => c.hex === folderColorOverride);

  // ─── Wrappers con history ────────────────────────────────────────────────────

  const setLabelWithHistory = (v) => { setLabel(v); pushDebounced('label', makeSnapshot({ ...stateRef.current, label: v })); };
  const setLabelStyleWithHistory = (v) => { setLabelStyle(v); pushHistory(makeSnapshot({ ...stateRef.current, labelStyle: v })); };
  const setTapeColorWithHistory = (v) => { setTapeColor(v); pushHistory(makeSnapshot({ ...stateRef.current, tapeColor: v })); };
  const setTapeOpacityWithHistory = (v) => { setTapeOpacity(v); pushDebounced('opacity', makeSnapshot({ ...stateRef.current, tapeOpacity: v })); };
  const setTapeRotationWithHistory = (v) => { setTapeRotation(v); pushDebounced('tapeRotation', makeSnapshot({ ...stateRef.current, tapeRotation: v })); };
  const setFontSizeMultiplierWithHistory = (v) => { setFontSizeMultiplier(v); pushDebounced('fontSize', makeSnapshot({ ...stateRef.current, fontSizeMultiplier: v })); };
  const setFontFamilyWithHistory = (v) => { setFontFamily(v); pushHistory(makeSnapshot({ ...stateRef.current, fontFamily: v })); };
  const setBadgeSizeWithHistory = (v) => { setBadgeSize(v); pushDebounced('badgeSize', makeSnapshot({ ...stateRef.current, badgeSize: v })); };
  const setFolderColorOverrideWithHistory = (v) => { setFolderColorOverride(v); pushHistory(makeSnapshot({ ...stateRef.current, folderColorOverride: v })); };
  const setCoverScaleWithHistory = (v) => { setCoverScale(v); pushDebounced('coverScale', makeSnapshot({ ...stateRef.current, coverScale: v })); };
  const setCoverRotationWithHistory = (v) => { setCoverRotation(v); pushDebounced('coverRotation', makeSnapshot({ ...stateRef.current, coverRotation: v })); };

  return (
    <div className="flex flex-col lg:flex-row h-[100dvh] bg-[#09090b] text-neutral-100 font-sans overflow-hidden">
      <span style={{ fontFamily: 'Space Mono', position: 'absolute', opacity: 0, pointerEvents: 'none' }}>.</span>

      <aside className="w-full lg:w-[400px] bg-[#121214] border-b lg:border-b-0 lg:border-r border-white/10 flex flex-col z-10 shrink-0 h-[45dvh] lg:h-full overflow-hidden">
        <div className="flex-1 overflow-y-auto custom-scrollbar min-h-0">
          <div className="relative p-6 lg:p-8 pb-4 lg:pb-6 border-b border-white/5 shrink-0">
            <div className="absolute top-4 right-5 lg:top-5 lg:right-7 flex items-center gap-0.5 bg-[#09090b] border border-neutral-800 rounded-md p-0.5">
              {['it', 'en'].map(l => (
                <button key={l} onClick={() => switchLang(l)}
                  className={`px-1.5 py-0.5 rounded text-[10px] font-semibold tracking-wide transition-all ${
                    lang === l ? 'bg-neutral-700 text-white' : 'text-neutral-500 hover:text-neutral-300'
                  }`}>{l.toUpperCase()}</button>
              ))}
            </div>
            <div className="flex items-center gap-3">
              <img src="/logo.png" alt="Folder Icon Studio" className="w-8 h-8 lg:w-10 lg:h-10 object-contain shrink-0" />
              <h1 className="text-xl lg:text-2xl font-bold tracking-tight text-white">Folder Icon Studio</h1>
            </div>
            <p className="text-neutral-400 text-xs lg:text-sm mt-1">{t.subtitle}</p>
          </div>

          <div className="p-6 lg:p-8 flex flex-col gap-6 lg:gap-8">
            {/* ── SECTION 1: Grafica ── */}
            <section className="space-y-4">
              <h2 className="text-sm font-semibold tracking-wide text-neutral-300 uppercase flex items-center gap-2">
                <LucideImage size={16} /> {t.section1}
              </h2>

              {/* ── Folder style selector ── */}
              <div className="space-y-2">
                <label className="text-xs text-neutral-500">{t.folderStyle}</label>
                <div className="flex gap-2">
                  {Object.values(FOLDERS).map(f => (
                    <button key={f.id} onClick={() => setFolderShape(f.id)}
                      className={`flex-1 py-2 rounded-lg border text-xs font-medium transition-all ${
                        folderShape === f.id
                          ? 'border-blue-500 bg-blue-500/10 text-blue-300'
                          : 'border-neutral-700/50 bg-[#09090b] text-neutral-400 hover:border-neutral-500'
                      }`}>
                      {f.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="relative">
                <label
                  className="flex flex-col items-center justify-center w-full h-36 px-4 transition-all border border-dashed rounded-xl cursor-pointer group overflow-hidden relative"
                  style={coverSrc ? { backgroundImage: `url(${coverSrc})`, backgroundSize: 'cover', backgroundPosition: 'center', borderColor: 'rgba(255,255,255,0.15)' } : { backgroundColor: '#09090b', borderColor: 'rgba(255,255,255,0.15)' }}
                >
                  {coverSrc && <div className="absolute inset-0 bg-black/50 group-hover:bg-black/40 transition-colors" />}
                  {!coverSrc && <div className="absolute inset-0 group-hover:bg-blue-500/5 transition-colors rounded-xl" />}
                  <div className="relative z-10 flex flex-col items-center space-y-2 text-center">
                    <div className={`p-3 rounded-full transition-colors ${coverSrc ? 'bg-white/10 group-hover:bg-white/20' : 'bg-neutral-800 group-hover:bg-blue-500/20'}`}>
                      <Upload size={20} className={coverSrc ? 'text-white' : 'text-neutral-400 group-hover:text-blue-400'} />
                    </div>
                    <span className={`font-medium text-sm ${coverSrc ? 'text-white' : 'text-neutral-300'}`}>{coverSrc ? t.changeImage : t.uploadImage}</span>
                    <span className={`text-xs ${coverSrc ? 'text-white/60' : 'text-neutral-500'}`}>{t.uploadFormats}</span>
                  </div>
                  <input ref={fileInputRef} type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
                </label>
                {coverSrc && (
                  <button onClick={handleClearImage} title={t.removeImage}
                    className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center rounded-full bg-neutral-800 hover:bg-red-500/80 text-neutral-400 hover:text-white transition-all z-20">
                    <X size={12} />
                  </button>
                )}
              </div>

              {coverSrc && (
                <div className="bg-[#09090b] p-4 rounded-xl border border-neutral-800/50 space-y-4">
                  <div>
                    <div className="flex justify-between items-center text-xs text-neutral-400 mb-2">
                      <span className="flex items-center gap-1"><ZoomIn size={14} /> {t.zoom}</span>
                      <span>{Math.round(coverScale * 100)}%</span>
                    </div>
                    <input type="range" min="0.5" max="2.5" step="0.05" value={coverScale}
                      onChange={e => setCoverScaleWithHistory(parseFloat(e.target.value))}
                      className="w-full h-1.5 bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-blue-500" />
                  </div>
                  <div>
                    <div className="flex justify-between items-center text-xs text-neutral-400 mb-2">
                      <span className="flex items-center gap-1"><RotateCw size={14} /> {t.coverRotation}</span>
                      <span>{coverRotation}°</span>
                    </div>
                    <input type="range" min="-180" max="180" step="1" value={coverRotation}
                      onChange={e => setCoverRotationWithHistory(parseInt(e.target.value))}
                      className="w-full h-1.5 bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-blue-500" />
                  </div>
                </div>
              )}

              {/* Colore cartella — solo per stili che lo supportano */}
              {FOLDERS[folderShape].tintFolder && (
                <div className="space-y-2">
                  <label className="text-xs text-neutral-500 flex items-center gap-1"><Palette size={13} /> {t.folderColor}</label>
                  <div className="flex flex-wrap gap-2 items-center">
                    <button onClick={() => setFolderColorOverrideWithHistory(null)} title={t.defaultColor}
                      className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all ${
                        folderColorOverride === null ? 'border-blue-500 scale-110 bg-[#4B8EF0] text-white' : 'border-neutral-600 bg-gradient-to-br from-[#6aadff] to-[#2171e8] hover:scale-105'
                      }`}>
                      {folderColorOverride === null && <Check size={11} />}
                    </button>
                    {FOLDER_COLORS.slice(1).map(color => (
                      <button key={color.id} onClick={() => setFolderColorOverrideWithHistory(color.hex)} title={color.name}
                        className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all ${
                          folderColorOverride === color.hex && !isCustomFolderColor ? 'border-white scale-110' : 'border-transparent hover:scale-105'
                        }`} style={{ backgroundColor: color.hex }}>
                        {folderColorOverride === color.hex && !isCustomFolderColor && <Check size={11} style={{ color: getTapeTextColor(color.hex) }} />}
                      </button>
                    ))}
                    <button onClick={() => folderColorInputRef.current?.click()} title={t.customColor}
                      className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all hover:scale-105 ${
                        isCustomFolderColor ? 'border-white scale-110' : 'border-dashed border-neutral-600 hover:border-neutral-400'
                      }`} style={isCustomFolderColor ? { backgroundColor: folderColorOverride } : {}}>
                      {isCustomFolderColor ? <Check size={11} style={{ color: '#fff', mixBlendMode: 'difference' }} /> : <Palette size={11} className="text-neutral-400" />}
                    </button>
                    <input ref={folderColorInputRef} type="color"
                      value={isCustomFolderColor ? folderColorOverride : customFolderColor}
                      onChange={e => { setCustomFolderColor(e.target.value); setFolderColorOverrideWithHistory(e.target.value); }}
                      className="sr-only" />
                  </div>
                </div>
              )}
            </section>

            <hr className="border-white/5" />

            {/* ── SECTION 2: Etichetta ── */}
            <section className="space-y-4">
              <h2 className="text-sm font-semibold tracking-wide text-neutral-300 uppercase flex items-center gap-2">
                <Type size={16} /> {t.section2}
              </h2>

              <div className="flex gap-2">
                {['dymo', 'banner', 'badge'].map(style => (
                  <button key={style} onClick={() => setLabelStyleWithHistory(style)}
                    className={`flex-1 py-2 rounded-lg border text-xs font-medium transition-all ${
                      labelStyle === style ? 'border-blue-500 bg-blue-500/10 text-blue-300' : 'border-neutral-700/50 bg-[#09090b] text-neutral-400 hover:border-neutral-500'
                    }`}>
                    {t[`style${style.charAt(0).toUpperCase()}${style.slice(1)}`]}
                  </button>
                ))}
              </div>

              <div className="space-y-2">
                <label className="text-xs text-neutral-500">{t.labelText}</label>
                <input type="text" value={label} maxLength={30} onChange={e => setLabelWithHistory(e.target.value)}
                  className="w-full bg-[#09090b] border border-neutral-700/50 rounded-xl p-3 text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none font-mono transition-all"
                  placeholder={t.labelPlaceholder} />
              </div>

              {label.trim() !== '' && (
                <>
                  <div className="space-y-2 pt-1">
                    <label className="text-xs text-neutral-500">{t.font}</label>
                    <div className="grid grid-cols-4 gap-2">
                      {FONT_OPTIONS.map(opt => (
                        <button key={opt.id} onClick={() => setFontFamilyWithHistory(opt.family)}
                          className={`py-2 px-1 rounded-lg border text-xs transition-all ${
                            fontFamily === opt.family ? 'border-blue-500 bg-blue-500/10 text-blue-300' : 'border-neutral-700/50 bg-[#09090b] text-neutral-400 hover:border-neutral-500'
                          }`} style={{ fontFamily: opt.family }}>
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs text-neutral-400">
                      <span className="flex items-center gap-1"><Type size={13} /> {t.fontSize}</span>
                      <span>{Math.round(fontSizeMultiplier * 100)}%</span>
                    </div>
                    <input type="range" min="0.4" max="1.6" step="0.05" value={fontSizeMultiplier}
                      onChange={e => setFontSizeMultiplierWithHistory(parseFloat(e.target.value))}
                      className="w-full h-1.5 bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-blue-500" />
                  </div>

                  {labelStyle === 'dymo' && (
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-xs text-neutral-400">
                        <span className="flex items-center gap-1"><RotateCw size={13} /> {t.tapeAngle}</span>
                        <div className="flex items-center gap-1">
                          <span>{tapeRotation.toFixed(1)}°</span>
                          {tapeRotation !== -2.3 && (
                            <button onClick={() => { setTapeRotation(-2.3); pushHistory(makeSnapshot({ ...stateRef.current, tapeRotation: -2.3 })); }}
                              className="text-neutral-600 hover:text-neutral-300 transition-colors ml-1" title={t.resetTip}>
                              <RotateCcw size={10} />
                            </button>
                          )}
                        </div>
                      </div>
                      <input type="range" min="-15" max="15" step="0.5" value={tapeRotation}
                        onChange={e => setTapeRotationWithHistory(parseFloat(e.target.value))}
                        className="w-full h-1.5 bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-blue-500" />
                    </div>
                  )}

                  {labelStyle === 'badge' && (
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-xs text-neutral-400">
                        <span className="flex items-center gap-1"><Circle size={13} /> {t.badgeSize}</span>
                        <div className="flex items-center gap-1">
                          <span>{badgeSize}px</span>
                          {badgeSize !== 160 && (
                            <button onClick={() => { setBadgeSize(160); pushHistory(makeSnapshot({ ...stateRef.current, badgeSize: 160 })); }}
                              className="text-neutral-600 hover:text-neutral-300 transition-colors ml-1" title={t.resetTip}>
                              <RotateCcw size={10} />
                            </button>
                          )}
                        </div>
                      </div>
                      <input type="range" min="60" max="220" step="5" value={badgeSize}
                        onChange={e => setBadgeSizeWithHistory(parseInt(e.target.value))}
                        className="w-full h-1.5 bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-blue-500" />
                    </div>
                  )}

                  {(labelStyle === 'dymo' || labelStyle === 'badge') && (
                    <div className="flex items-center justify-between">
                      <p className="flex items-center gap-1.5 text-[11px] text-neutral-500">
                        <Move size={11} className="shrink-0" /> {t.dragHint}
                      </p>
                      {((labelStyle === 'dymo' && (tapeOffset.x !== 0 || tapeOffset.y !== 0)) ||
                        (labelStyle === 'badge' && (badgeOffset.x !== 0 || badgeOffset.y !== 0))) && (
                        <button
                          onClick={() => {
                            if (labelStyle === 'dymo') { setTapeOffset({ x: 0, y: 0 }); pushHistory(makeSnapshot({ ...stateRef.current, tapeOffset: { x: 0, y: 0 } })); }
                            else { setBadgeOffset({ x: 0, y: 0 }); pushHistory(makeSnapshot({ ...stateRef.current, badgeOffset: { x: 0, y: 0 } })); }
                          }}
                          className="flex items-center gap-1 text-[10px] text-neutral-600 hover:text-neutral-300 transition-colors ml-2 shrink-0">
                          <RotateCcw size={10} /> {t.resetBtn}
                        </button>
                      )}
                    </div>
                  )}

                  <div className="space-y-2 pt-2">
                    <label className="text-xs text-neutral-500 flex items-center gap-1">
                      <Palette size={14} /> {labelStyle === 'banner' ? t.colorBanner : labelStyle === 'badge' ? t.colorBadge : t.colorTape}
                    </label>
                    <div className="flex gap-3 items-center">
                      {TAPE_COLORS.map(color => (
                        <button key={color.id} onClick={() => setTapeColorWithHistory(color.hex)}
                          className={`relative w-8 h-8 rounded-full border-2 transition-all flex items-center justify-center ${
                            tapeColor === color.hex ? 'border-blue-500 scale-110' : 'border-transparent hover:scale-105'
                          }`} style={{ backgroundColor: color.hex }} title={color.name}>
                          {tapeColor === color.hex && <Check size={14} className={color.id === 'white' || color.id === 'vintage' ? 'text-black' : 'text-white'} />}
                        </button>
                      ))}
                      <button onClick={() => tapeColorInputRef.current?.click()} title={t.customColor}
                        className={`relative w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all hover:scale-105 ${
                          !isPresetColor ? 'border-blue-500 scale-110' : 'border-dashed border-neutral-600 hover:border-neutral-400'
                        }`} style={!isPresetColor ? { backgroundColor: tapeColor } : {}}>
                        {isPresetColor ? <Palette size={12} className="text-neutral-400" /> : <Check size={14} style={{ color: '#fff', mixBlendMode: 'difference' }} />}
                      </button>
                      <input ref={tapeColorInputRef} type="color" value={tapeColor}
                        onChange={e => setTapeColorWithHistory(e.target.value)}
                        className="sr-only" />
                    </div>
                  </div>

                  <div className="space-y-2 pt-4 border-t border-white/5">
                    <div className="flex justify-between items-center text-xs text-neutral-400 mb-2">
                      <span className="flex items-center gap-1"><Droplet size={14} /> {t.opacity}</span>
                      <span>{Math.round(tapeOpacity * 100)}%</span>
                    </div>
                    <input type="range" min="0.1" max="1" step="0.05" value={tapeOpacity}
                      onChange={e => setTapeOpacityWithHistory(parseFloat(e.target.value))}
                      className="w-full h-1.5 bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-blue-500" />
                  </div>
                </>
              )}
            </section>

            <hr className="border-white/5" />

            {/* ── SECTION 3: Stili salvati ── */}
            <section className="space-y-4 pb-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPresetsOpen(o => !o)}
                  className="flex-1 flex items-center justify-between text-sm font-semibold tracking-wide text-neutral-300 uppercase"
                >
                  <span className="flex items-center gap-2"><Bookmark size={16} /> {t.section3}</span>
                  <ChevronDown size={15} className={`transition-transform text-neutral-500 ${presetsOpen ? 'rotate-180' : ''}`} />
                </button>
                <button
                  onClick={() => setSection3HintVisible(v => !v)}
                  className="text-neutral-600 hover:text-neutral-400 transition-colors shrink-0"
                  title={t.section3Hint}
                >
                  <Info size={14} />
                </button>
              </div>

              {section3HintVisible && (
                <p className="text-[11px] text-neutral-500 bg-neutral-800/40 border border-neutral-700/40 rounded-lg px-3 py-2 leading-relaxed">
                  {t.section3Hint}
                </p>
              )}

              {presetsOpen && (
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={presetName}
                      onChange={e => setPresetName(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleSavePreset()}
                      placeholder={t.presetNamePlaceholder}
                      maxLength={30}
                      className="flex-1 bg-[#09090b] border border-neutral-700/50 rounded-xl px-3 py-2 text-white text-xs focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none font-mono transition-all placeholder:text-neutral-600"
                    />
                    <button
                      onClick={handleSavePreset}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-neutral-700/50 bg-[#09090b] text-neutral-300 hover:border-blue-500/60 hover:text-blue-300 transition-all text-xs font-medium shrink-0"
                    >
                      <BookmarkPlus size={14} /> {t.savePreset}
                    </button>
                  </div>

                  {presets.length === 0 ? (
                    <p className="text-xs text-neutral-600 text-center py-3">{t.noPresets}</p>
                  ) : (
                    <div className="space-y-2">
                      {presets.map(preset => (
                        <div key={preset.id}
                          className="flex items-center gap-2.5 bg-[#09090b] border border-neutral-800/60 rounded-xl px-3 py-2 group hover:border-neutral-700/60 transition-colors">
                          {preset.thumbnail ? (
                            <img
                              src={preset.thumbnail}
                              alt={preset.name}
                              className="w-10 h-10 rounded-lg object-cover shrink-0 border border-white/10"
                            />
                          ) : (
                            <div
                              className="w-10 h-10 rounded-lg shrink-0 border border-white/10 flex items-center justify-center"
                              style={{ backgroundColor: preset.tapeColor }}
                            >
                              <Bookmark size={14} className="text-white/60" />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <span className="block text-xs text-neutral-200 font-mono truncate">{preset.name}</span>
                            <span className="text-[10px] text-neutral-600">{preset.labelStyle}</span>
                          </div>
                          <button
                            onClick={() => handleApplyPreset(preset)}
                            className="text-[11px] text-blue-400 hover:text-blue-300 font-medium transition-colors shrink-0 px-1">
                            {t.applyPreset}
                          </button>
                          <button
                            onClick={() => handleDeletePreset(preset.id)}
                            className="text-neutral-700 hover:text-red-400 transition-colors shrink-0">
                            <Trash2 size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </section>
          </div>
        </div>

        {/* Footer sticky */}
        <div className="sidebar-footer shrink-0 p-6 lg:p-8 pt-5 bg-[#121214]">
          <div className="flex gap-2 mb-4">
            <button onClick={undo} disabled={!canUndo} title={`${t.undo} (Cmd+Z)`}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl border text-xs font-medium transition-all ${
                canUndo ? 'border-neutral-700/50 bg-[#09090b] text-neutral-300 hover:border-neutral-500 hover:text-white' : 'border-neutral-800/30 bg-[#09090b]/40 text-neutral-600 cursor-not-allowed'
              }`}>
              <Undo2 size={13} /> {t.undo}
            </button>
            <button onClick={redo} disabled={!canRedo} title={`${t.redo} (Cmd+Shift+Z)`}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl border text-xs font-medium transition-all ${
                canRedo ? 'border-neutral-700/50 bg-[#09090b] text-neutral-300 hover:border-neutral-500 hover:text-white' : 'border-neutral-800/30 bg-[#09090b]/40 text-neutral-600 cursor-not-allowed'
              }`}>
              <Redo2 size={13} /> {t.redo}
            </button>
          </div>

          <div ref={downloadMenuRef} className="relative w-full mb-6">
            <div className="flex w-full">
              <button onClick={handleDownloadPng} disabled={isExporting}
                className="liquid-glass-btn flex-1 font-medium py-3.5 px-4 rounded-l-xl flex items-center justify-center gap-2">
                {isExporting ? <span className="animate-spin w-4 h-4 border-2 border-white/30 border-t-white rounded-full" /> : <Download size={18} />}
                {t.download} PNG
              </button>
              <button onClick={() => setDownloadMenuOpen(o => !o)} disabled={isExporting}
                className="liquid-glass-btn font-medium py-3.5 px-3 rounded-r-xl border-l border-white/10 flex items-center justify-center"
                aria-label="Altre opzioni di download">
                <ChevronDown size={16} className={`transition-transform ${downloadMenuOpen ? 'rotate-180' : ''}`} />
              </button>
            </div>
            {downloadMenuOpen && (
              <div className="absolute bottom-full mb-2 left-0 right-0 bg-[#1c1c1e] border border-white/10 rounded-xl overflow-hidden shadow-2xl z-50">
                <button onClick={handleDownloadPng} className="w-full flex items-center gap-3 px-4 py-3 text-sm text-neutral-200 hover:bg-white/5 transition-colors text-left">
                  <Download size={15} className="text-neutral-400 shrink-0" />
                  <div><div className="font-medium">{t.downloadPng}</div><div className="text-[11px] text-neutral-500">Universale, massima qualità</div></div>
                </button>
                <div className="h-px bg-white/5" />
                <button onClick={handleDownloadIcns} className="w-full flex items-center gap-3 px-4 py-3 text-sm text-neutral-200 hover:bg-white/5 transition-colors text-left">
                  <Download size={15} className="text-neutral-400 shrink-0" />
                  <div><div className="font-medium">{t.downloadIcns}</div><div className="text-[11px] text-neutral-500">11 risoluzioni + Retina @2x</div></div>
                </button>
                <div className="h-px bg-white/5" />
                <button onClick={handleDownloadIco} className="w-full flex items-center gap-3 px-4 py-3 text-sm text-neutral-200 hover:bg-white/5 transition-colors text-left">
                  <Download size={15} className="text-neutral-400 shrink-0" />
                  <div><div className="font-medium">{t.downloadIco}</div><div className="text-[11px] text-neutral-500">6 risoluzioni (16→256px)</div></div>
                </button>
              </div>
            )}
          </div>

          <div className="flex flex-col items-center gap-3 pt-6 border-t border-white/5">
            <span className="text-[10px] text-neutral-500 font-mono tracking-widest lowercase">made with love by antonello :)</span>
            <div className="flex items-center gap-5 text-neutral-400">
              <a href="https://x.com/antonello23" target="_blank" rel="noreferrer" className="hover:text-white transition-colors"><IconX size={16} /></a>
              <a href="https://www.instagram.com/antonelloan23/" target="_blank" rel="noreferrer" className="hover:text-white transition-colors"><IconInstagram size={16} /></a>
              <a href="https://buymeacoffee.com/antonello23" target="_blank" rel="noreferrer" className="hover:text-white transition-colors"><Coffee size={16} /></a>
            </div>
          </div>
        </div>
      </aside>

      <main className="flex-1 relative flex flex-col items-center justify-center min-h-0 overflow-hidden bg-dot-pattern p-4 md:p-8">
        <style dangerouslySetInnerHTML={{__html: `
          .bg-dot-pattern { background-color: #09090b; background-image: radial-gradient(rgba(255,255,255,0.08) 1px, transparent 1px); background-size: 24px 24px; }
          .custom-scrollbar::-webkit-scrollbar { width: 6px; }
          .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
          .custom-scrollbar::-webkit-scrollbar-thumb { background-color: rgba(255,255,255,0.1); border-radius: 10px; }
          /* ── Frosted footer ─────────────────────────────── */
          .sidebar-footer {
            position: relative;
            backdrop-filter: blur(16px) saturate(180%);
            -webkit-backdrop-filter: blur(16px) saturate(180%);
            background: rgba(18, 18, 20, 0.82);
            border-top: 1px solid rgba(255,255,255,0.06);
          }
          .sidebar-footer::before {
            content: '';
            position: absolute;
            top: -48px;
            left: 0;
            right: 0;
            height: 48px;
            pointer-events: none;
            background: linear-gradient(to bottom, transparent, rgba(18,18,20,0.82));
          }
          /* ───────────────────────────────────────────────── */
          .liquid-glass-btn {
            position: relative; overflow: hidden; color: rgba(255,255,255,0.92); font-weight: 500;
            background: linear-gradient(145deg, rgba(255,255,255,0.13) 0%, rgba(255,255,255,0.05) 50%, rgba(255,255,255,0.10) 100%);
            border: 1px solid rgba(255,255,255,0.18);
            box-shadow: 0 2px 0 rgba(255,255,255,0.12) inset, 0 -1px 0 rgba(0,0,0,0.25) inset, 0 8px 32px rgba(0,0,0,0.35), 0 1px 8px rgba(255,255,255,0.04);
            backdrop-filter: blur(12px) saturate(160%); -webkit-backdrop-filter: blur(12px) saturate(160%);
            transition: all 0.2s ease; text-shadow: 0 1px 3px rgba(0,0,0,0.4);
          }
          .liquid-glass-btn::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 50%; background: linear-gradient(180deg, rgba(255,255,255,0.10) 0%, transparent 100%); border-radius: inherit; pointer-events: none; }
          .liquid-glass-btn::after { content: ''; position: absolute; inset: 0; background: radial-gradient(ellipse at 30% 20%, rgba(255,255,255,0.08) 0%, transparent 60%); pointer-events: none; }
          .liquid-glass-btn:hover { background: linear-gradient(145deg, rgba(255,255,255,0.20) 0%, rgba(255,255,255,0.09) 50%, rgba(255,255,255,0.15) 100%); border-color: rgba(255,255,255,0.28); box-shadow: 0 2px 0 rgba(255,255,255,0.16) inset, 0 -1px 0 rgba(0,0,0,0.25) inset, 0 12px 40px rgba(0,0,0,0.4), 0 1px 12px rgba(255,255,255,0.06); }
          .liquid-glass-btn:active { transform: scale(0.98); box-shadow: 0 1px 0 rgba(255,255,255,0.08) inset, 0 -1px 0 rgba(0,0,0,0.25) inset, 0 4px 16px rgba(0,0,0,0.3); }
          .liquid-glass-btn:disabled { opacity: 0.6; cursor: not-allowed; }
          @keyframes bounce-x { 0%,100% { transform: translateX(0); } 50% { transform: translateX(-6px); } }
          .animate-bounce-x { animation: bounce-x 1.8s ease-in-out infinite; }
        `}} />

        {!coverSrc && (
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 text-neutral-600 text-xs pointer-events-none select-none">
            <span className="animate-bounce-x">←</span><span>{t.uploadHint}</span>
          </div>
        )}

        <div className="relative group w-full h-full flex items-center justify-center max-w-4xl" style={{ touchAction: 'none' }}>
          {(coverSrc || label.trim() !== '') && (
            <div className="absolute top-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2 bg-neutral-800/80 backdrop-blur text-neutral-300 text-xs px-3 py-1.5 rounded-full pointer-events-none border border-white/10 z-20">
              <Move size={12} /> {t.dragCanvasHint}
            </div>
          )}
          <canvas ref={canvasRef} width={1024} height={1024}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
            className="max-w-full max-h-full aspect-square object-contain drop-shadow-2xl"
          />
        </div>
      </main>
      <Analytics />
    </div>
  );
}
