import { useState, useEffect, useRef, useCallback } from 'react';
import { Upload, Download, Type, Image as LucideImage, ZoomIn, Palette, Check, Move, RotateCw, Droplet, Coffee, RotateCcw, X, ChevronDown, Circle, Undo2, Redo2, BookmarkPlus, Bookmark, Trash2, Info, Maximize2 } from 'lucide-react';
import { Analytics } from '@vercel/analytics/react';

const TRANSLATIONS = {
  it: {
    subtitle: 'Crea icone cartella macOS personalizzate.',
    section1: '1. Grafica',
    folderStyle: 'Stile cartella',
    folderColor: 'Colore cartella',
    cassetteColor: 'Colore cassetta',
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
    fontSize: 'Dimensione testo',
    tapeSize: 'Dimensione nastro',
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
    subtitle: 'Create custom macOS folder icons.',
    section1: '1. Artwork',
    folderStyle: 'Folder style',
    folderColor: 'Folder color',
    cassetteColor: 'Cassette color',
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
    fontSize: 'Text size',
    tapeSize: 'Tape size',
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

const CASSETTE_COLORS = [
  { id: 'default', hex: null, name: 'Default' },
  { id: 'black', hex: '#1a1a1a', name: 'Nero' },
  { id: 'white', hex: '#e8e4dc', name: 'Bianco' },
  { id: 'red', hex: '#c0392b', name: 'Rosso' },
  { id: 'blue', hex: '#2563a8', name: 'Blu' },
  { id: 'green', hex: '#27613a', name: 'Verde' },
  { id: 'yellow', hex: '#c8a832', name: 'Giallo' },
  { id: 'orange', hex: '#c0622b', name: 'Arancione' },
  { id: 'teal', hex: '#1a6b72', name: 'Teal' },
];

const CASSETTE_PNG_W = 2183;
const CASSETTE_PNG_H = 1417;
const CASSETTE_LABEL_X = 135;
const CASSETTE_LABEL_Y = 103;
const CASSETTE_LABEL_W = 1909;
const CASSETTE_LABEL_H = 929;

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
    tintFolder: true,
    getFolderRect: (cw, ch) => {
      const pngRatio = CASSETTE_PNG_W / CASSETTE_PNG_H;
      let w, h, x, y;
      if (cw / ch > pngRatio) {
        h = ch; w = h * pngRatio; x = (cw - w) / 2; y = 0;
      } else {
        w = cw; h = w / pngRatio; x = 0; y = (ch - h) / 2;
      }
      return { x, y, w, h };
    },
    clipRect: {
      x: CASSETTE_LABEL_X, y: CASSETTE_LABEL_Y,
      w: CASSETTE_LABEL_W, h: CASSETTE_LABEL_H,
      vw: CASSETTE_PNG_W, vh: CASSETTE_PNG_H,
    },
    buildFlapPath: () => {},
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

// ─── Export helpers ───────────────────────────────────────────────────────────

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

// ─── Canvas drawing helpers ───────────────────────────────────────────────────

const drawTape = (ctx, w, h, text, tapeHex, opacity, tapeOffsetX, tapeOffsetY, tapeRotationDeg, fontSizeMultiplier, fontFamily, tapeScale = 1) => {
  const tapeW = w * 0.55 * tapeScale;
  const tapeH = h * 0.12 * tapeScale;
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
  const zigAmp = Math.max(4, 8 * tapeScale);
  ctx.moveTo(x, y);
  for (let i = 1; i <= zigs; i++) ctx.lineTo(x + (i % 2 === 0 ? 0 : zigAmp), y + i * zigH);
  ctx.lineTo(x + tapeW, y + tapeH);
  for (let i = zigs - 1; i >= 0; i--) ctx.lineTo(x + tapeW - (i % 2 === 0 ? 0 : zigAmp), y + i * zigH);
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

// ─── Preset helpers ───────────────────────────────────────────────────────────

const loadPresetsFromStorage = () => {
  try { const raw = localStorage.getItem(LS_PRESETS_KEY); return raw ? JSON.parse(raw) : []; } catch { return []; }
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
    ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = 'high';
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
  const [cassetteMaskImg, setCassetteMaskImg] = useState(null);
  const [coverSrc, setCoverSrc] = useState(null);
  const [coverImg, setCoverImg] = useState(null);
  const [label, setLabel] = useState('Archivio 01');
  const [labelStyle, setLabelStyle] = useState('dymo');
  const [tapeColor, setTapeColor] = useState('#f4ebd0');
  const [tapeOpacity, setTapeOpacity] = useState(1);
  const [tapeRotation, setTapeRotation] = useState(-2.3);
  const [tapeScale, setTapeScale] = useState(1);
  const [fontSizeMultiplier, setFontSizeMultiplier] = useState(1);
  const [fontFamily, setFontFamily] = useState('Space Mono');
  const [dominantColor, setDominantColor] = useState(null);
  const [folderColorOverride, setFolderColorOverride] = useState(null);
  const [customFolderColor, setCustomFolderColor] = useState('